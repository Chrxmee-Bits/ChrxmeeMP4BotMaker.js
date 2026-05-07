// src/Client.js — Bot Client
const Commands = require('./Commands');
const API = require('./API');
const EventEmitter = require('events');

class Client extends EventEmitter {
    constructor(options = {}) {
        super();
        this.token = options.token || '';
        this.prefix = options.prefix || '!';
        this.user = null;
        this.guilds = new Map();
        this.totalMessages = 0;
        this.connected = false;
        this.commands = new Commands(this);
        this.api = new API(this);
        this.activity = null;
    }

    async login() {
        if (!this.token) throw new Error('No bot token provided. Get one from /developers');
        
        // Authenticate with Chrxmee-MP4
        const botData = await this.api.authenticate(this.token);
        if (!botData || botData.status !== 'approved') {
            throw new Error('Bot not approved or token invalid.');
        }
        
        this.user = botData;
        this.connected = true;
        this.emit('ready');
        
        // Start polling for messages
        this._startPolling();
        return this;
    }

    _startPolling() {
        setInterval(async () => {
            try {
                const messages = await this.api.getPendingMessages(this.user.id);
                for (const msg of messages) {
                    this.totalMessages++;
                    this.emit('message', msg);
                    this.commands.handle(msg);
                }
            } catch (e) {}
        }, 2000);
    }

    setActivity(text, emoji = '') {
        this.activity = { text, emoji };
    }

    async searchVideo(query) {
        return await this.api.searchVideo(query);
    }

    async getProfile(username) {
        return await this.api.getProfile(username);
    }

    async sendDM(username, text) {
        return await this.api.sendDM(this.user.id, username, text);
    }

    async sendMessage(guildId, channelId, text) {
        return await this.api.sendMessage(this.user.id, guildId, channelId, text);
    }
}

module.exports = Client;
