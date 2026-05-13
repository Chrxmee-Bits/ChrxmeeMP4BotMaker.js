const BaseManager = require('./BaseManager');
const WatchParty = require('../structures/WatchParty');

class WatchPartyManager extends BaseManager {
    constructor(client, guild, watchPartyData) {
        super(client);
        this.guild = guild;
        if (watchPartyData && watchPartyData.url) {
            this.add({ id: 'wp_' + this.guild.id, ...watchPartyData });
        }
    }

    _createInstance(data) {
        return new WatchParty(this.client, this.guild, data);
    }

    async start(url, title = 'Watch Party') {
        const wp = {
            id: 'wp_' + this.guild.id,
            url,
            title,
            startedBy: this.client.user.id,
            startedAt: Date.now(),
            isLive: true,
            viewers: [this.client.user.id],
            currentTime: 0,
            isPlaying: true
        };

        const guilds = this.client.storage.getGuilds();
        const g = guilds.find(g => g.id === this.guild.id);
        if (g) {
            g.watchParty = wp;
            this.client.storage.saveGuilds(guilds);
            return this.add(wp);
        }
        return null;
    }

    async end() {
        const guilds = this.client.storage.getGuilds();
        const g = guilds.find(g => g.id === this.guild.id);
        if (g) {
            g.watchParty = null;
            this.client.storage.saveGuilds(guilds);
        }
        this.clear();
        return true;
    }

    get current() {
        return this.get('wp_' + this.guild.id) || null;
    }

    get isActive() {
        const wp = this.current;
        return wp ? wp.isLive : false;
    }

    toJSON() {
        const wp = this.current;
        return wp ? wp.toJSON() : null;
    }
}

module.exports = WatchPartyManager;
