const BaseManager = require('./BaseManager');
const Message = require('../structures/Message');

class MessageManager extends BaseManager {
    constructor(client, channel, messages) {
        super(client);
        this.channel = channel;
        this.guild = channel.guild;
        if (messages) {
            messages.forEach(m => {
                m.guildId = this.guild.id;
                m.channelId = this.channel.id;
                this.add(m);
            });
        }
    }

    _createInstance(data) {
        return new Message(this.client, {
            ...data,
            guildId: this.guild.id,
            channelId: this.channel.id
        });
    }

    async fetch(id) {
        const guilds = this.client.storage.getGuilds();
        const guild = guilds.find(g => g.id === this.guild.id);
        if (!guild) return null;
        for (const cat of (guild.categories || [])) {
            const ch = (cat.channels || []).find(c => c.id === this.channel.id);
            if (ch && ch.messages) {
                const data = ch.messages.find(m => m.id === id);
                if (data) return this.add({ ...data, guildId: this.guild.id, channelId: this.channel.id });
            }
        }
        return null;
    }

    async fetchAll(limit = 50) {
        const guilds = this.client.storage.getGuilds();
        const guild = guilds.find(g => g.id === this.guild.id);
        if (!guild) return this;
        for (const cat of (guild.categories || [])) {
            const ch = (cat.channels || []).find(c => c.id === this.channel.id);
            if (ch && ch.messages) {
                const msgs = ch.messages.slice(-limit);
                msgs.forEach(m => this.add({ ...m, guildId: this.guild.id, channelId: this.channel.id }));
            }
        }
        return this;
    }

    async delete(id) {
        const guilds = this.client.storage.getGuilds();
        const guild = guilds.find(g => g.id === this.guild.id);
        if (!guild) return false;
        for (const cat of (guild.categories || [])) {
            const ch = (cat.channels || []).find(c => c.id === this.channel.id);
            if (ch && ch.messages) {
                ch.messages = ch.messages.filter(m => m.id !== id);
                this.client.storage.saveGuilds(guilds);
                this.delete(id);
                return true;
            }
        }
        return false;
    }

    get cache() {
        return [...this.values()].sort((a, b) => a.timestamp - b.timestamp);
    }

    get last() {
        const arr = this.cache;
        return arr.length > 0 ? arr[arr.length - 1] : null;
    }

    get first() {
        const arr = this.cache;
        return arr.length > 0 ? arr[0] : null;
    }
}

module.exports = MessageManager;
