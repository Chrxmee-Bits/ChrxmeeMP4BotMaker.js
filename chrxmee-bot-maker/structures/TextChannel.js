const GuildChannel = require('./GuildChannel');

class TextChannel extends GuildChannel {
    constructor(client, guild, data) {
        super(client, guild, data);
        this.type = 'text';
    }

    async startTyping() {
        // Placeholder — could emit typing indicator in future
    }

    async stopTyping() {
        // Placeholder
    }

    get lastMessage() {
        const msgs = this.messages.cache;
        if (msgs.length === 0) return null;
        return msgs[msgs.length - 1];
    }

    get lastMessageId() {
        const last = this.lastMessage;
        return last ? last.id : null;
    }
}

module.exports = TextChannel;
