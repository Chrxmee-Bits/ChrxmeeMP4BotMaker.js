const Base = require('./Base');

class Sticker extends Base {
    constructor(client, guild, data) {
        super(client, data.id || 'sticker_' + Date.now().toString(36));
        this.guild = guild;
        this.name = data.name || '';
        this.url = data.url || '';
        this.packName = data.packName || data.pack || '';
        this.createdAt = data.createdAt || new Date().toISOString();
    }

    get pack() {
        return this.packName;
    }

    async delete() {
        return this.guild.stickers.delete(this.id);
    }

    toString() {
        return `[Sticker: ${this.name}]`;
    }
}

module.exports = Sticker;
