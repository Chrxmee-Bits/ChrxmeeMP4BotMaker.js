const Base = require('./Base');

class TVScheduleEntry extends Base {
    constructor(client, guild, data) {
        super(client, data.id || 'tvsch_' + Date.now().toString(36));
        this.guild = guild;
        this.time = data.time || '';
        this.title = data.title || 'Untitled';
        this.url = data.url || '';
        this.addedBy = data.addedBy || '';
        this.addedAt = data.addedAt || Date.now();
    }

    get adder() {
        return this.client.users.get(this.addedBy);
    }

    get isNow() {
        const now = new Date();
        const currentTime = now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0');
        return this.time === currentTime;
    }

    async remove() {
        const guilds = this.client.storage.getGuilds();
        const g = guilds.find(g => g.id === this.guild.id);
        if (g && g.tvSchedule) {
            g.tvSchedule = g.tvSchedule.filter(e => e.id !== this.id);
            this.client.storage.saveGuilds(guilds);
            return true;
        }
        return false;
    }
}

module.exports = TVScheduleEntry;
