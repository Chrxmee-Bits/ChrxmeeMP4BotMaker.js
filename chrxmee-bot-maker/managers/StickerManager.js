const BaseManager = require('./BaseManager');
const Sticker = require('../structures/Sticker');

class StickerManager extends BaseManager {
    constructor(client, guild) {
        super(client);
        this.guild = guild;
    }

    _createInstance(data) {
        return new Sticker(this.client, this.guild, data);
    }

    async create(name, url, packName = '') {
        const sticker = {
            id: 'sticker_' + Date.now().toString(36),
            name,
            url,
            packName,
            createdAt: new Date().toISOString()
        };

        const guilds = this.client.storage.getGuilds();
        const g = guilds.find(g => g.id === this.guild.id);
        if (g) {
            g.stickerList = g.stickerList || [];
            g.stickerList.push(sticker);
            this.client.storage.saveGuilds(guilds);
            return this.add(sticker);
        }
        return null;
    }

    async delete(id) {
        const guilds = this.client.storage.getGuilds();
        const g = guilds.find(g => g.id === this.guild.id);
        if (g) {
            g.stickerList = (g.stickerList || []).filter(s => s.id !== id);
            this.client.storage.saveGuilds(guilds);
        }
        this.delete(id);
        return true;
    }

    get packs() {
        const packs = new Map();
        for (const [, sticker] of this) {
            const name = sticker.packName || 'Default';
            if (!packs.has(name)) packs.set(name, []);
            packs.get(name).push(sticker);
        }
        return packs;
    }

    toArray() {
        return [...this.values()].map(s => ({
            id: s.id, name: s.name, url: s.url,
            packName: s.packName, createdAt: s.createdAt
        }));
    }
}

module.exports = StickerManager;
