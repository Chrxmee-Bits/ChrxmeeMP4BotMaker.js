const Base = require('./Base');

class GuildEvent extends Base {
    constructor(client, guild, data) {
        super(client, data.id || 'evt_' + Date.now().toString(36));
        this.guild = guild;
        this.name = data.name || '';
        this.description = data.description || '';
        this.location = data.location || '';
        this.startTime = data.startTime || data.startsAt || null;
        this.endTime = data.endTime || data.endsAt || null;
        this.createdBy = data.createdBy || '';
        this.createdAt = data.createdAt || Date.now();
        this.attendees = data.attendees || [];
    }

    get creator() {
        return this.client.users.get(this.createdBy);
    }

    get isActive() {
        if (!this.startTime || !this.endTime) return false;
        const now = Date.now();
        return now >= new Date(this.startTime).getTime() && now <= new Date(this.endTime).getTime();
    }

    get isUpcoming() {
        if (!this.startTime) return false;
        return Date.now() < new Date(this.startTime).getTime();
    }

    get isPast() {
        if (!this.endTime) return false;
        return Date.now() > new Date(this.endTime).getTime();
    }

    get attendeeCount() {
        return this.attendees.length;
    }

    async join() {
        if (!this.attendees.includes(this.client.user.id)) {
            this.attendees.push(this.client.user.id);
        }
        return this._save();
    }

    async leave() {
        this.attendees = this.attendees.filter(a => a !== this.client.user.id);
        return this._save();
    }

    async delete() {
        return this.guild.events.delete(this.id);
    }

    async _save() {
        const guilds = this.client.storage.getGuilds();
        const g = guilds.find(g => g.id === this.guild.id);
        if (g) {
            g.events = g.events || [];
            const idx = g.events.findIndex(e => e.id === this.id);
            if (idx !== -1) {
                g.events[idx].attendees = this.attendees;
                this.client.storage.saveGuilds(guilds);
            }
        }
        return this;
    }
}

module.exports = GuildEvent;
