const EventEmitter = require('events');
const ChrxmeeBotOptions = require('./ChrxmeeBotOptions');
const GuildManager = require('../managers/GuildManager');
const UserManager = require('../managers/UserManager');
const VideoManager = require('../managers/VideoManager');
const NotificationManager = require('../managers/NotificationManager');
const PluginManager = require('../managers/PluginManager');
const ProfileManager = require('../managers/ProfileManager');
const CommentManager = require('../managers/CommentManager');
const MessageHandler = require('../events/MessageHandler');
const VoiceHandler = require('../events/VoiceHandler');
const PresenceHandler = require('../events/PresenceHandler');
const GuildHandler = require('../events/GuildHandler');
const NotificationHandler = require('../events/NotificationHandler');
const PluginHandler = require('../events/PluginHandler');
const RateLimiter = require('../util/RateLimiter');
const Storage = require('../util/Storage');
const BotApplication = require('../structures/BotApplication');
const AuthError = require('../errors/AuthError');

class ChrxmeeBot extends EventEmitter {
    constructor(config = {}) {
        super();
        this.options = new ChrxmeeBotOptions(config);
        this.token = this.options.token;
        this.prefix = this.options.prefix;
        this.user = null;
        this.application = null;
        this.connected = false;
        this.totalMessages = 0;
        this.commands = new Map();
        this.slashCommands = new Map();
        this.activity = null;
        this.status = 'online';
        this.uptime = 0;
        this.storage = new Storage();

        // Filesystem
        this.guilds = new GuildManager(this);
        this.users = new UserManager(this);
        this.videos = new VideoManager(this);
        this.notifications = new NotificationManager(this);
        this.plugins = new PluginManager(this);
        this.profiles = new ProfileManager(this);
        this.comments = new CommentManager(this);

        // Handlers
        this.messageHandler = new MessageHandler(this);
        this.voiceHandler = new VoiceHandler(this);
        this.presenceHandler = new PresenceHandler(this);
        this.guildHandler = new GuildHandler(this);
        this.notificationHandler = new NotificationHandler(this);
        this.pluginHandler = new PluginHandler(this);

        // Rate limiter
        this.rateLimiter = new RateLimiter(this.options);

        this._pollIntervals = [];
    }

    async login() {
        if (!this.token) throw new AuthError('No token provided.');
        const bots = this.storage.getBots();
        const botData = bots.find(b => b.token === this.token);
        if (!botData) throw new AuthError('Invalid token.');
        if (botData.status !== 'approved') throw new AuthError(`Bot is ${botData.status}.`);

        const isLive = this.storage.getBotLive(botData.id);
        if (isLive !== 'true') throw new AuthError('Bot is not live. Start it from the Developer Portal.');

        this.user = { id: botData.id, username: botData.id, name: botData.name, avatar: botData.avatar };
        this.application = new BotApplication(this, botData);
        this.connected = true;
        this.uptime = Date.now();

        // Load caches
        await this.guilds.fetchAll();
        await this.users.fetchAll();

        this.emit('ready');

        if (this.options.autoPoll) {
            this._startPolling();
        }

        this._updatePresence();
        console.log(`🤖 ${this.application.name} is online on Chrxmee-MP4!`);
        return this;
    }

    command(name, callback) {
        this.commands.set(name.toLowerCase(), callback);
        return this;
    }

    slashCommand(name, description, options = [], callback) {
        this.slashCommands.set(name.toLowerCase(), { description, options, callback });
        return this;
    }

    setActivity(text, type = 'watching', emoji = '🎬') {
        this.activity = { text, type, emoji };
        this._updatePresence();
        return this;
    }

    setStatus(status) {
        const valid = ['online', 'idle', 'dnd', 'offline'];
        if (valid.includes(status)) {
            this.status = status;
            this._updatePresence();
        }
        return this;
    }

    async sendMessage(guildId, channelId, text) {
        if (!this.rateLimiter.check('messages')) {
            this.emit('rateLimited', 'messages');
            return null;
        }
        const msg = {
            id: 'msg_' + Date.now().toString(36),
            from: this.user.id,
            text: text,
            timestamp: Date.now(),
            botMessage: true,
            botName: this.application.name,
            botAvatar: this.application.avatar
        };
        const guilds = this.storage.getGuilds();
        const guild = guilds.find(g => g.id === guildId);
        if (guild) {
            for (const cat of (guild.categories || [])) {
                const ch = (cat.channels || []).find(c => c.id === channelId);
                if (ch) {
                    ch.messages = ch.messages || [];
                    ch.messages.push(msg);
                    this.totalMessages++;
                    this.storage.saveGuilds(guilds);
                    return msg;
                }
            }
        }
        return null;
    }

    async sendDM(username, text) {
        if (!this.rateLimiter.check('dms')) return null;
        const added = this.storage.getAddedBots();
        if (!added.includes(this.user.id)) return null;
        const convoId = [this.user.id, username].sort().join('_');
        const msg = {
            id: 'dm_' + Date.now().toString(36),
            convoId,
            from: this.user.id,
            to: username,
            text: text,
            timestamp: Date.now(),
            botMessage: true
        };
        const dms = this.storage.getBotDMs();
        dms.push(msg);
        this.storage.saveBotDMs(dms);
        this.totalMessages++;
        return msg;
    }

    async _react(message, emoji) {
        const reactions = this.storage.getBotReactions();
        const key = message.guildId + '_' + message.channelId + '_' + message.id;
        reactions[key] = reactions[key] || [];
        reactions[key].push({ emoji, by: this.user.id, timestamp: Date.now() });
        this.storage.saveBotReactions(reactions);
    }

    async joinGuild(inviteCode) {
        if (!this.rateLimiter.check('guildJoins')) return false;
        if (this.guilds.size >= 250) return false;
        const guilds = this.storage.getGuilds();
        const guild = guilds.find(g => g.invites && g.invites.some(i => i.code === inviteCode && i.active));
        if (!guild) return false;
        if (!guild.members) guild.members = [];
        if (guild.members.some(m => m.username === this.user.id)) return false;
        guild.members.push({ username: this.user.id, role: 'member', joinedAt: new Date().toISOString() });
        this.storage.saveGuilds(guilds);

        // Update bot's guild list
        const bots = this.storage.getBots();
        const bot = bots.find(b => b.id === this.user.id);
        if (bot) {
            bot.guilds = bot.guilds || [];
            if (!bot.guilds.includes(guild.id)) bot.guilds.push(guild.id);
            this.storage.saveBots(bots);
        }

        await this.guilds.fetch(guild.id);
        this.emit('guildJoin', this.guilds.get(guild.id));
        return true;
    }

    async leaveGuild(guildId) {
        const guilds = this.storage.getGuilds();
        const guild = guilds.find(g => g.id === guildId);
        if (guild) {
            guild.members = (guild.members || []).filter(m => m.username !== this.user.id);
            this.storage.saveGuilds(guilds);
            this.guilds.delete(guildId);
            this.emit('guildLeave', guild);
        }
    }

    async searchVideo(query) {
        const videos = this.storage.getPublicLibrary();
        return videos.filter(v =>
            (v.title || '').toLowerCase().includes(query.toLowerCase()) ||
            (v.description || '').toLowerCase().includes(query.toLowerCase()) ||
            (v.tags || []).some(t => t.toLowerCase().includes(query.toLowerCase()))
        );
    }

    async getProfile(username) {
        const profiles = this.storage.getProfiles();
        return profiles[username] || null;
    }

    async getGuild(guildId) {
        return this.guilds.fetch(guildId);
    }

    _updatePresence() {
        if (!this.user) return;
        const bots = this.storage.getBots();
        const idx = bots.findIndex(b => b.id === this.user.id);
        if (idx !== -1) {
            bots[idx].presence = {
                activity: this.activity,
                status: this.status,
                lastActive: Date.now()
            };
            this.storage.saveBots(bots);
        }
    }

    _startPolling() {
        // Message polling
        const msgInterval = setInterval(async () => {
            if (!this.connected) return;
            try {
                const messages = this.storage.getBotMessages();
                for (const msg of messages) {
                    if (msg.processed) continue;
                    msg.processed = true;
                    this.storage.saveBotMessages(messages);
                    this.emit('message', msg);
                    this.messageHandler.handle(msg);
                }
                this.presenceHandler.check();
            } catch (e) {}
        }, this.options.pollInterval);
        this._pollIntervals.push(msgInterval);

        // VC polling
        const vcInterval = setInterval(() => {
            if (!this.connected) return;
            this.voiceHandler.check();
        }, 2000);
        this._pollIntervals.push(vcInterval);

        // Guild polling
        const guildInterval = setInterval(() => {
            if (!this.connected) return;
            this.guildHandler.check();
        }, 5000);
        this._pollIntervals.push(guildInterval);

        // Notification polling
        const notifInterval = setInterval(() => {
            if (!this.connected) return;
            this.notificationHandler.check();
        }, 10000);
        this._pollIntervals.push(notifInterval);
    }

    _createContext(message) {
        const guild = this.guilds.get(message.guildId);
        const channel = guild ? guild.channels.get(message.channelId) : null;
        const member = guild ? guild.members.get(message.from) : null;
        const author = this.users.get(message.from);
        return { guild, channel, member, author, content: message.text, reply: (text) => this.sendMessage(message.guildId, message.channelId, text), send: (text) => this.sendMessage(message.guildId, message.channelId, text), dm: (text) => this.sendDM(message.from, text), react: (emoji) => this._react(message, emoji), voice: channel && channel.type === 'voice' ? channel : null };
    }

    destroy() {
        this._pollIntervals.forEach(clearInterval);
        this._pollIntervals = [];
        this.connected = false;
        this.emit('disconnect');
    }
}

module.exports = ChrxmeeBot;
