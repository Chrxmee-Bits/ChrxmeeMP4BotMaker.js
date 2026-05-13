const Base = require('./Base');

class Emoji extends Base {
    constructor(client, guild, data) {
        super(client, data.id || 'emoji_' + Date.now().toString(36));
        this.guild = guild;
        this.name = data.name || '';
        this.emoji = data.emoji || data.icon || '😀';
        this.url = data.url || '';
        this.animated = data.animated || false;
        this.createdBy = data.createdBy || '';
        this.createdAt = data.createdAt || new Date().toISOString();
    }

    get isCustom() {
        return !!this.url;
    }

    toString() {
        return this.isCustom ? `<:${this.name}:${this.id}>` : this.emoji;
    }

    async delete() {
        return this.guild.emojis.delete(this.id);
    }
}

module.exports = Emoji;
