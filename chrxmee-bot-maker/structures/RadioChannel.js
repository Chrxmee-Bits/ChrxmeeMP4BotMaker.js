const GuildChannel = require('./GuildChannel');

class RadioChannel extends GuildChannel {
    constructor(client, guild, data) {
        super(client, guild, data);
        this.type = 'radio';
        this.station = data.station || null;
        this.currentTrack = data.currentTrack || null;
        this.listeners = data.listeners || [];
    }

    async setStation(url) {
        this.station = url;
        return this._save();
    }

    get listenerCount() {
        return this.listeners.length;
    }

    async join() {
        if (!this.listeners.includes(this.client.user.id)) {
            this.listeners.push(this.client.user.id);
        }
        return this._save();
    }

    async leave() {
        this.listeners = this.listeners.filter(u => u !== this.client.user.id);
        return this._save();
    }
}

module.exports = RadioChannel;
