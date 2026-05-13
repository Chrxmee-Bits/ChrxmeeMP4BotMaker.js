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
            g.emojiList = g.emojiList
