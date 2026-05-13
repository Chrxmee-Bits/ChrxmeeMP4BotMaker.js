const GuildChannel = require('./GuildChannel');

class TVChannel extends GuildChannel {
    constructor(client, guild, data) {
        super(client, guild, data);
        this.type = 'tv';
        this.currentBroadcast = data.currentBroadcast || null;
        this.schedule = data.schedule || [];
    }

    get isLive() {
        return this.currentBroadcast !== null;
    }

    get currentShow() {
        return this.currentBroadcast;
    }

    async startBroadcast(video) {
        this.currentBroadcast = {
            url: video.url || video.src,
            title: video.title || 'Untitled Broadcast',
            startedAt: Date.now(),
            startedBy: this.client.user.id
        };
        return this._save();
    }

    async stopBroadcast() {
        this.currentBroadcast = null;
        return this._save();
    }

    async addToSchedule(time, video) {
        this.schedule.push({
            time,
            title: video.title || 'Untitled',
            url: video.url || video.src,
            addedBy: this.client.user.id
        });
        return this._save();
    }

    async removeFromSchedule(index) {
        this.schedule.splice(index, 1);
        return this._save();
    }

    async _save() {
        const guilds = this.client.storage.getGuilds();
        const guild = guilds.find(g => g.id === this.guild.id);
        if (!guild) return this;
        for (const cat of (guild.categories || [])) {
            const ch = (cat.channels || []).find(c => c.id === this.id);
            if (ch) {
                ch.currentBroadcast = this.currentBroadcast;
                ch.schedule = this.schedule;
                this.client.storage.saveGuilds(guilds);
                return this;
            }
        }
        return this;
    }
}

module.exports = TVChannel;
