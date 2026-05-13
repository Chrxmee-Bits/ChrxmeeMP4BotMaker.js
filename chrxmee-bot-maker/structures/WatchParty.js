const Base = require('./Base');

class WatchParty extends Base {
    constructor(client, guild, data) {
        super(client, data.id || 'wp_' + Date.now().toString(36));
        this.guild = guild;
        this.url = data.url || '';
        this.startedBy = data.startedBy || '';
        this.startedAt = data.startedAt || Date.now();
        this.isLive = data.isLive !== false;
        this.viewers = data.viewers || [];
        this.currentTime = data.currentTime || 0;
        this.isPlaying = data.isPlaying !== false;
    }

    get host() {
        return this.client.users.get(this.startedBy);
    }

    get viewerCount() {
        return this.viewers.length;
    }

    async join() {
        if (!this.viewers.includes(this.client.user.id)) {
            this.viewers.push(this.client.user.id);
        }
        return this._save();
    }

    async leave() {
        this.viewers = this.viewers.filter(v => v !== this.client.user.id);
        return this._save();
    }

    async end() {
        this.isLive = false;
        this.isPlaying = false;
        return this._save();
    }

    async _save() {
        const guilds = this.client.storage.getGuilds();
        const g = guilds.find(g => g.id === this.guild.id);
        if (g) {
            g.watchParty = {
                url: this.url,
                startedBy: this.startedBy,
                startedAt: this.startedAt,
                isLive: this.isLive,
                viewers: this.viewers,
                currentTime: this.currentTime,
                isPlaying: this.isPlaying
            };
            this.client.storage.saveGuilds(guilds);
        }
        return this;
    }
}

module.exports = WatchParty;
