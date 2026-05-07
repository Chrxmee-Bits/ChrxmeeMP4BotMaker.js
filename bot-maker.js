// bot-maker.js — ChrxmeeMP4BotMaker-JS (Root Edition)
const EventEmitter = require('events');

class ChrxmeeBot extends EventEmitter {
    constructor(config = {}) {
        super();
        this.token = config.token || '';
        this.prefix = config.prefix || '!';
        this.user = null;
        this.guilds = new Map();
        this.totalMessages = 0;
        this.connected = false;
        this.commands = new Map();
        this.slashCommands = new Map();
        this.activity = null;
        this.status = 'online';
        this.rateLimits = { messages: 0, dms: 0, guildJoins: 0 };
        this._resetRateLimits();
    }

    // ============ AUTHENTICATION ============
    async login() {
        if (!this.token) throw new Error('No token. Get one at /developers');
        const bots = this._getBots();
        const botData = bots.find(b => b.token === this.token);
        if (!botData) throw new Error('Invalid token.');
        if (botData.status !== 'approved') throw new Error(`Bot is ${botData.status}.`);
        this.user = botData;
        this.connected = true;
        this.emit('ready');
        this._startPolling();
        this._updatePresence();
        console.log(`🤖 ${this.user.name} is online on Chrxmee-MP4!`);
        return this;
    }

    // ============ COMMANDS ============
    command(name, callback) {
        this.commands.set(name.toLowerCase(), callback);
        return this;
    }

    slashCommand(name, description, options = [], callback) {
        this.slashCommands.set(name.toLowerCase(), { description, options, callback });
        return this;
    }

    async _handleCommand(message) {
        if (!message.text) return;
        
        // Prefix commands
        if (message.text.startsWith(this.prefix)) {
            const args = message.text.slice(this.prefix.length).trim().split(/\s+/);
            const cmdName = args.shift().toLowerCase();
            const cmd = this.commands.get(cmdName);
            if (cmd) {
                if (!this._checkRateLimit('messages')) return;
                const ctx = this._createContext(message);
                cmd(ctx, args);
            }
        }
        
        // Slash commands (detected by / prefix)
        if (message.text.startsWith('/')) {
            const parts = message.text.slice(1).trim().split(/\s+/);
            const cmdName = parts.shift().toLowerCase();
            const slashCmd = this.slashCommands.get(cmdName);
            if (slashCmd) {
                if (!this._checkRateLimit('messages')) return;
                const ctx = this._createContext(message);
                slashCmd.callback(ctx, parts);
            }
        }
        
        // Mention detection
        if (message.text.includes(`@${this.user.name}`)) {
            this.emit('mention', this._createContext(message));
        }
    }

    _createContext(message) {
        return {
            author: message.from,
            guildId: message.guildId,
            channelId: message.channelId,
            content: message.text,
            reply: (text) => this.sendMessage(message.guildId, message.channelId, text),
            send: (text) => this.sendMessage(message.guildId, message.channelId, text),
            dm: (text) => this.sendDM(message.from, text),
            react: (emoji) => this._react(message, emoji),
            guild: message.guildId ? this.guilds.get(message.guildId) : null
        };
    }

    // ============ ACTIVITIES & PRESENCE ============
    setActivity(text, type = 'watching', emoji = '🎬') {
        this.activity = { text, type, emoji };
        this._updatePresence();
        return this;
    }

    setStatus(status) {
        const validStatuses = ['online', 'idle', 'dnd', 'offline'];
        if (validStatuses.includes(status)) {
            this.status = status;
            this._updatePresence();
        }
        return this;
    }

    _updatePresence() {
        if (!this.user) return;
        const bots = this._getBots();
        const idx = bots.findIndex(b => b.id === this.user.id);
        if (idx !== -1) {
            bots[idx].presence = {
                activity: this.activity,
                status: this.status,
                lastActive: Date.now()
            };
            this._saveBots(bots);
        }
    }

    // ============ MESSAGING ============
    async sendMessage(guildId, channelId, text) {
        if (!this._checkRateLimit('messages')) return null;
        const msg = {
            id: 'msg_' + Date.now().toString(36),
            from: this.user.username || this.user.id,
            text: text,
            timestamp: Date.now(),
            botMessage: true,
            botName: this.user.name,
            botAvatar: this.user.avatar
        };
        // Store in guild channel
        const guilds = this._getGuilds();
        const guild = guilds.find(g => g.id === guildId);
        if (guild) {
            for (const cat of (guild.categories || [])) {
                const ch = (cat.channels || []).find(c => c.id === channelId);
                if (ch) {
                    ch.messages = ch.messages || [];
                    ch.messages.push(msg);
                    this.totalMessages++;
                    this._saveGuilds(guilds);
                    return msg;
                }
            }
        }
        return null;
    }

    async sendDM(username, text) {
        if (!this._checkRateLimit('dms')) return null;
        const added = JSON.parse(localStorage.getItem('chrxmeemp4_added_bots') || '[]');
        if (!added.includes(this.user.id)) return null;
        const convoId = [this.user.id, username].sort().join('_');
        const msg = {
            id: 'dm_' + Date.now().toString(36),
            convoId: convoId,
            from: this.user.username || this.user.id,
            to: username,
            text: text,
            timestamp: Date.now(),
            botMessage: true
        };
        const allDMs = JSON.parse(localStorage.getItem('chrxmeemp4_bot_dms') || '[]');
        allDMs.push(msg);
        localStorage.setItem('chrxmeemp4_bot_dms', JSON.stringify(allDMs));
        this.totalMessages++;
        return msg;
    }

    async _react(message, emoji) {
        const reactions = JSON.parse(localStorage.getItem('chrxmeemp4_bot_reactions') || '{}');
        const key = message.guildId + '_' + message.channelId + '_' + message.id;
        reactions[key] = reactions[key] || [];
        reactions[key].push({ emoji, by: this.user.id, timestamp: Date.now() });
        localStorage.setItem('chrxmeemp4_bot_reactions', JSON.stringify(reactions));
    }

    // ============ GUILD MANAGEMENT ============
    async joinGuild(inviteCode) {
        if (!this._checkRateLimit('guildJoins')) return false;
        if (this.guilds.size >= 50) return false;
        const guilds = this._getGuilds();
        const guild = guilds.find(g => g.invites && g.invites.some(i => i.code === inviteCode && i.active));
        if (!guild) return false;
        if (!guild.members) guild.members = [];
        if (guild.members.some(m => m.username === this.user.id)) return false;
        guild.members.push({ username: this.user.id, role: 'bot', joinedAt: new Date().toISOString() });
        this._saveGuilds(guilds);
        this.guilds.set(guild.id, guild);
        this.emit('guildJoin', guild);
        return true;
    }

    async leaveGuild(guildId) {
        const guilds = this._getGuilds();
        const guild = guilds.find(g => g.id === guildId);
        if (guild) {
            guild.members = (guild.members || []).filter(m => m.username !== this.user.id);
            this._saveGuilds(guilds);
            this.guilds.delete(guildId);
            this.emit('guildLeave', guild);
        }
    }

    // ============ API HELPERS ============
    async searchVideo(query) {
        const videos = JSON.parse(localStorage.getItem('chrxmeemp4_public_library') || '[]');
        return videos.filter(v => 
            (v.title || '').toLowerCase().includes(query.toLowerCase()) ||
            (v.description || '').toLowerCase().includes(query.toLowerCase()) ||
            (v.tags || []).some(t => t.toLowerCase().includes(query.toLowerCase()))
        );
    }

    async getProfile(username) {
        const profiles = JSON.parse(localStorage.getItem('chrxmeemp4_profiles') || '{}');
        return profiles[username] || null;
    }

    async getGuild(guildId) {
        const guilds = this._getGuilds();
        return guilds.find(g => g.id === guildId) || null;
    }

    // ============ RATE LIMITING ============
    _checkRateLimit(type) {
        if (this.rateLimits[type] <= 0) {
            this.emit('rateLimited', type);
            return false;
        }
        this.rateLimits[type]--;
        return true;
    }

    _resetRateLimits() {
        setInterval(() => {
            this.rateLimits = { messages: 30, dms: 10, guildJoins: 5 };
        }, 60000);
    }

    // ============ POLLING ============
    _startPolling() {
        setInterval(async () => {
            if (!this.connected) return;
            try {
                const messages = this._getPendingMessages();
                for (const msg of messages) {
                    if (msg.processed) continue;
                    msg.processed = true;
                    this._saveMessages(messages);
                    this.emit('message', msg);
                    await this._handleCommand(msg);
                }
            } catch (e) {}
        }, 2000);
    }

    // ============ STORAGE HELPERS ============
    _getBots() { try { return JSON.parse(localStorage.getItem('chrxmeemp4_bots') || '[]'); } catch(e) { return []; } }
    _saveBots(bots) { localStorage.setItem('chrxmeemp4_bots', JSON.stringify(bots)); }
    _getGuilds() { try { return JSON.parse(localStorage.getItem('chrxmeemp4_guilds') || '[]'); } catch(e) { return []; } }
    _saveGuilds(guilds) { localStorage.setItem('chrxmeemp4_guilds', JSON.stringify(guilds)); }
    _getPendingMessages() { try { return JSON.parse(localStorage.getItem('chrxmeemp4_bot_messages') || '[]'); } catch(e) { return []; } }
    _saveMessages(msgs) { localStorage.setItem('chrxmeemp4_bot_messages', JSON.stringify(msgs)); }
}

// ============ UTILITIES ============
ChrxmeeBot.Utils = {
    formatDuration(s) { if (!s || isNaN(s)) return '0:00'; const m = Math.floor(s/60); const sec = Math.floor(s%60); return `${m}:${sec.toString().padStart(2,'0')}`; },
    formatNumber(n) { if (!n) return '0'; if (n>=1000000) return (n/1000000).toFixed(1)+'M'; if (n>=1000) return (n/1000).toFixed(1)+'K'; return n.toString(); },
    timeAgo(d) { const diff=Date.now()-d.getTime(); const m=Math.floor(diff/60000); const h=Math.floor(diff/3600000); const days=Math.floor(diff/86400000); if (m<1) return 'just now'; if (m<60) return m+'m'; if (h<24) return h+'h'; return days+'d'; },
    randomId() { return 'id_'+Date.now().toString(36)+'_'+Math.random().toString(36).substring(2,8); }
};

module.exports = ChrxmeeBot;
