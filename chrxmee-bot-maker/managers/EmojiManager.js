const BaseManager = require('./BaseManager');
const Emoji = require('../structures/Emoji');

class EmojiManager extends BaseManager {
    constructor(client, guild) {
        super(client);
        this.guild = guild;
    }

    _createInstance(data) {
        return new Emoji(this.client, this.guild, data);
    }

    async create(name, url, options = {}) {
        const emoji = {
            id: 'emoji_' + Date.now().toString(36),
            name,
            url,
            animated: options.animated || false,
            createdBy: this.client.user.id,
            createdAt: new Date().toISOString()
        };

        const guilds = this.client.storage.getGuilds();
        const g = guilds.find(g => g.id === this.guild.id);
        if (g) {
            g.emojiList = g.emojiList || [];
            g.emojiList.push(emoji);
            this.client.storage.saveGuilds(guilds);
            return this.add(emoji);
        }
        return null;
    }

    async delete(id) {
        const guilds = this.client.storage.getGuilds();
        const g = guilds.find(g => g.id === this.guild.id);
        if (g) {
            g.emojiList = (g.emojiList || []).filter(e => e.id !== id);
            this.client.storage.saveGuilds(guilds);
        }
        this.delete(id);
        return true;
    }

    toArray() {
        return [...this.values()].map(e => ({
            id: e.id, name: e.name, emoji: e.emoji,
            url: e.url, animated: e.animated,
            createdBy: e.createdBy, createdAt: e.createdAt
        }));
    }
}

module.exports = EmojiManager;
