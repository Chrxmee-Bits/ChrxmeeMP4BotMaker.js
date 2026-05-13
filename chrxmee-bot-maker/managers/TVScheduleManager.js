const BaseManager = require('./BaseManager');
const TVScheduleEntry = require('../structures/TVScheduleEntry');

class TVScheduleManager extends BaseManager {
    constructor(client, guild, schedule) {
        super(client);
        this.guild = guild;
        if (schedule) {
            schedule.forEach((s, i) => {
                this.add({ id: s.id || 'tvsch_' + i, ...s });
            });
        }
    }

    _createInstance(data) {
        return new TVScheduleEntry(this.client, this.guild, data);
    }

    async add(time, title, url = '') {
        const entry = {
            id: 'tvsch_' + Date.now().toString(36),
            time,
            title,
            url,
            addedBy: this.client.user.id,
            addedAt: Date.now()
        };

        const guilds = this.client.storage.getGuilds();
        const g = guilds.find(g => g.id === this.guild.id);
        if (g) {
            g.tvSchedule = g.tvSchedule || [];
            g.tvSchedule.push(entry);
            this.client.storage.saveGuilds(guilds);
            return this.add(entry);
        }
        return null;
    }

    async remove(id) {
        const guilds = this.client.storage.getGuilds();
        const g = guilds.find(g => g.id === this.guild.id);
        if (g) {
            g.tvSchedule = (g.tvSchedule || []).filter(e => e.id !== id);
            this.client.storage.saveGuilds(guilds);
        }
        this.delete(id);
        return true;
    }

    get upcoming() {
        return [...this.values()].sort((a, b) => a.time.localeCompare(b.time));
    }

    get now() {
        return [...this.values()].find(e => e.isNow) || null;
    }

    toArray() {
        return [...this.values()].map(e => ({
            id: e.id, time: e.time, title: e.title,
            url: e.url, addedBy: e.addedBy, addedAt: e.addedAt
        }));
    }
}

module.exports = TVScheduleManager;
