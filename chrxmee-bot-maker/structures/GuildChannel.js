const Base = require('./Base');
const MessageManager = require('../managers/MessageManager');

class GuildChannel extends Base {
    constructor(client, guild, data) {
        super(client, data.id);
        this.guild = guild;
        this._raw = data;
        this.name = data.name || '';
        this.type = data.type || 'text';
        this.topic = data.topic || '';
        this.slowMode = data.slowMode || 0;
        this.categoryId = data.categoryId || null;
        this.position = data.position || 0;
        this.nsfw = data.nsfw || false;
        this.messages = new MessageManager(client, this, data.messages || []);
        this.pinnedMessages = data.pinnedMessages || [];
    }

    async setName(name) { this.name = name; return this._save(); }
    async setTopic(topic) { this.topic = topic; return this._save(); }
    async setSlowMode(seconds) { this.slowMode = seconds; return this._save(); }

    async send(content) {
        return this.client.sendMessage(this.guild.id, this.id, content);
    }

    async bulkDelete(count = 10) {
        const guilds = this.client.storage.getGuilds();
        const guild = guilds.find(g => g.id === this.guild.id);
        if (!guild) return 0;
        for (const cat of (guild.categories || [])) {
            const ch = (cat.channels || []).find(c => c.id === this.id);
            if (ch && ch.messages) {
                const deleted = ch.messages.splice(-count);
                this.client.storage.saveGuilds(guilds);
                return deleted.length;
            }
        }
        return 0;
    }

    get isText() { return this.type === 'text'; }
    get isVoice() { return this.type === 'voice'; }
    get isStage() { return this.type === 'stage'; }
    get isRadio() { return this.type === 'radio'; }
    get isTV() { return this.type === 'tv'; }

    toString() { return `#${this.name}`; }

    async _save() {
        const guilds = this.client.storage.getGuilds();
        const guild = guilds.find(g => g.id === this.guild.id);
        if (!guild) return this;
        for (const cat of (guild.categories || [])) {
            const idx = (cat.channels || []).findIndex(c => c.id === this.id);
            if (idx !== -1) {
                cat.channels[idx] = { ...cat.channels[idx], name: this.name, topic: this.topic, slowMode: this.slowMode, nsfw: this.nsfw };
                this.client.storage.saveGuilds(guilds);
                return this;
            }
        }
        return this;
    }
}

module.exports = GuildChannel;
