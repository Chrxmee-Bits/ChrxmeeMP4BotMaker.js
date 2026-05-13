const Base = require('./Base');

class Message extends Base {
    constructor(client, data) {
        super(client, data.id || 'msg_' + Date.now().toString(36));
        
        this.guildId = data.guildId;
        this.channelId = data.channelId;
        this.authorId = data.from;
        this.content = data.text || '';
        this.timestamp = data.timestamp || Date.now();
        this.gameMsg = data.gameMsg || false;
        this.botMessage = data.botMessage || false;
        this.botName = data.botName || '';
        this.botAvatar = data.botAvatar || '';
    }

    get guild() {
        return this.client.guilds.get(this.guildId);
    }

    get channel() {
        const guild = this.guild;
        return guild?.channels.get(this.channelId);
    }

    get member() {
        const guild = this.guild;
        return guild?.members.get(this.authorId);
    }

    get author() {
        return this.client.users.get(this.authorId);
    }

    async reply(content) {
        return this.client.sendMessage(this.guildId, this.channelId, content);
    }

    async react(emoji) {
        return this.client._react(this, emoji);
    }

    async delete() {
        const guilds = this.client._getGuilds();
        const guild = guilds.find(g => g.id === this.guildId);
        if (guild) {
            for (const cat of (guild.categories || [])) {
                const ch = (cat.channels || []).find(c => c.id === this.channelId);
                if (ch) {
                    ch.messages = (ch.messages || []).filter(m => m.id !== this.id);
                    this.client._saveGuilds(guilds);
                    return true;
                }
            }
        }
        return false;
    }
}

module.exports = Message;
