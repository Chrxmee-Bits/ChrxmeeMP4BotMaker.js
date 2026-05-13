const EventEmitter = require('events');
const GuildManager = require('../managers/GuildManager');
const UserManager = require('../managers/UserManager');
const VideoManager = require('../managers/VideoManager');
const MessageHandler = require('../events/MessageHandler');
const VoiceHandler = require('../events/VoiceHandler');
const PresenceHandler = require('../events/PresenceHandler');
const Storage = require('../util/Storage');
const RateLimiter = require('../util/RateLimiter');

class ChrxmeeBot extends EventEmitter {
    constructor(config = {}) {
        super();
        this.token = config.token || '';
        this.prefix = config.prefix || '!';
        this.user = null;
        this.connected = false;
        this.totalMessages = 0;
        this.commands = new Map();
        this.slashCommands = new Map();
        this.activity = null;
        this.status = 'online';

        // Filesystem Managers
        this.guilds = new GuildManager(this);
        this.users = new UserManager(this);
        this.videos = new VideoManager(this);

        // Handlers
        this.messageHandler = new MessageHandler(this);
        this.voiceHandler = new VoiceHandler(this);
        this.presenceHandler = new PresenceHandler(this);

        // Rate limiter
        this.rateLimiter = new RateLimiter();
    }

    // ... rest of your existing methods (login, commands, messaging, etc.)
    // Updated _createContext:

    _createContext(message) {
        const guild = this.guilds.get(message.guildId);
        const channel = guild?.channels.get(message.channelId);
        const member = guild?.members.get(message.from);
        const author = this.users.get(message.from);

        return {
            guild,
            channel,
            member,
            author,
            content: message.text,
            reply: (text) => this.sendMessage(message.guildId, message.channelId, text),
            send: (text) => this.sendMessage(message.guildId, message.channelId, text),
            dm: (text) => this.sendDM(message.from, text),
            react: (emoji) => this._react(message, emoji),
            voice: channel?.type === 'voice' ? channel : null
        };
    }
}

module.exports = ChrxmeeBot;
