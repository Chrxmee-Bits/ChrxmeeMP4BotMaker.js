const Base = require('./Base');

class BotApplication extends Base {
    constructor(client, data) {
        super(client, data.id);
        this.name = data.name || '';
        this.description = data.description || '';
        this.avatar = data.avatar || '';
        this.prefix = data.prefix || '!';
        this.token = data.token || '';
        this.ownerId = data.owner || '';
        this.status = data.status || 'pending';
        this.createdAt = data.createdAt || new Date().toISOString();
        this.guildIds = data.guilds || [];
        this.totalMessages = data.totalMessages || 0;
        this.accent = data.accent || '#e50914';
        this.tags = data.tags || [];
        this.webhookUrl = data.webhookUrl || '';
        this.presence = data.presence || null;
    }

    get owner() {
        return this.client.users.get(this.ownerId);
    }

    get guildCount() {
        return this.guildIds.length;
    }

    get isApproved() {
        return this.status === 'approved';
    }

    get isPending() {
        return this.status === 'pending';
    }

    get isBanned() {
        return this.status === 'banned';
    }

    async regenerateToken() {
        this.token = 'chrx_bot_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 10);
        const bots = this.client.storage.getBots();
        const idx = bots.findIndex(b => b.id === this.id);
        if (idx !== -1) {
            bots[idx].token = this.token;
            this.client.storage.saveBots(bots);
        }
        return this.token;
    }

    async setWebhook(url) {
        this.webhookUrl = url;
        const bots = this.client.storage.getBots();
        const idx = bots.findIndex(b => b.id === this.id);
        if (idx !== -1) {
            bots[idx].webhookUrl = url;
            this.client.storage.saveBots(bots);
        }
        return this;
    }

    toString() {
        return this.name;
    }
}

module.exports = BotApplication;
