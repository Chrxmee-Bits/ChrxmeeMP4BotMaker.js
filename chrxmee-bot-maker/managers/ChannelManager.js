const BaseManager = require('./BaseManager');
const TextChannel = require('../structures/TextChannel');
const VoiceChannel = require('../structures/VoiceChannel');
const StageChannel = require('../structures/StageChannel');
const RadioChannel = require('../structures/RadioChannel');
const TVChannel = require('../structures/TVChannel');

class ChannelManager extends BaseManager {
    constructor(client, guild, categories) {
        super(client);
        this.guild = guild;
        if (categories) {
            categories.forEach(cat => {
                (cat.channels || []).forEach(ch => {
                    ch.categoryId = cat.id;
                    ch.categoryName = cat.name;
                    this.add(ch);
                });
            });
        }
    }

    _createInstance(data) {
        switch (data.type) {
            case 'voice': return new VoiceChannel(this.client, this.guild, data);
            case 'stage': return new StageChannel(this.client, this.guild, data);
            case 'radio': return new RadioChannel(this.client, this.guild, data);
            case 'tv': return new TVChannel(this.client, this.guild, data);
            default: return new TextChannel(this.client, this.guild, data);
        }
    }

    async create(name, options = {}) {
        const type = options.type || 'text';
        const channel = {
            id: 'ch_' + Date.now().toString(36),
            name,
            type,
            topic: options.topic || '',
            slowMode: options.slowMode || 0,
            nsfw: options.nsfw || false,
            messages: [],
            vcState: type === 'voice' || type === 'stage' ? {
                participants: [],
                currentDJ: null,
                currentVideo: null,
                queue: [],
                isPlaying: false
            } : undefined
        };

        const guilds = this.client.storage.getGuilds();
        const guild = guilds.find(g => g.id === this.guild.id);
        if (!guild) return null;

        const catId = options.categoryId || (guild.categories[0] ? guild.categories[0].id : null);
        if (!catId) {
            guild.categories = [{ id: 'cat_' + Date.now().toString(36), name: 'General', channels: [] }];
        }
        const cat = guild.categories.find(c => c.id === (catId || guild.categories[0].id));
        if (cat) {
            channel.categoryId = cat.id;
            cat.channels = cat.channels || [];
            cat.channels.push(channel);
            this.client.storage.saveGuilds(guilds);
            return this.add(channel);
        }
        return null;
    }

    async delete(id) {
        const guilds = this.client.storage.getGuilds();
        const guild = guilds.find(g => g.id === this.guild.id);
        if (!guild) return false;
        for (const cat of (guild.categories || [])) {
            cat.channels = (cat.channels || []).filter(c => c.id !== id);
        }
        this.client.storage.saveGuilds(guilds);
        this.delete(id);
        return true;
    }

    toArray() {
        const categories = [];
        const seenCats = new Set();
        for (const [, ch] of this) {
            const catId = ch.categoryId || 'uncategorized';
            if (!seenCats.has(catId)) {
                seenCats.add(catId);
                categories.push({
                    id: catId,
                    name: ch._raw?.categoryName || 'General',
                    channels: []
                });
            }
            const cat = categories.find(c => c.id === catId);
            if (cat) {
                cat.channels.push({
                    id: ch.id, name: ch.name, type: ch.type,
                    topic: ch.topic, slowMode: ch.slowMode,
                    messages: ch._raw?.messages || [],
                    vcState: ch.voiceState ? ch.voiceState.toJSON() : undefined,
                    pinnedMessages: ch.pinnedMessages
                });
            }
        }
        return categories;
    }
}

module.exports = ChannelManager;
