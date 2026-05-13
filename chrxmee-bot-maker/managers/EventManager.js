const BaseManager = require('./BaseManager');
const GuildEvent = require('../structures/Event');

class EventManager extends BaseManager {
    constructor(client, guild, events) {
        super(client);
        this.guild = guild;
        if (events) {
            events.forEach(e => this.add(e));
        }
    }

    _createInstance(data) {
        return new GuildEvent(this.client, this.guild, data);
    }

    async create(name, options = {}) {
        const event = {
            id: 'evt_' + Date.now().toString(36),
            name,
            description: options.description || '',
            location: options.location || '',
            startTime: options.startTime || options.startsAt || null,
            endTime: options.endTime || options.endsAt || null,
            createdBy: this.client.user.id,
            createdAt: Date.now(),
            attendees: [this.client.user.id]
        };

        const guilds = this.client.storage.getGuilds();
        const g = guilds.find(g => g.id === this.guild.id);
        if (g) {
            g.events = g.events || [];
            g.events.push(event);
            this.client.storage.saveGuilds(guilds);
            return this.add(event);
        }
        return null;
    }

    async delete(id) {
        const guilds = this.client.storage.getGuilds();
        const g = guilds.find(g => g.id === this.guild.id);
        if (g) {
            g.events = (g.events || []).filter(e => e.id !== id);
            this.client.storage.saveGuilds(guilds);
        }
        this.delete(id);
        return true;
    }

    get active() {
        return [...this.values()].filter(e => e.isActive);
    }

    get upcoming() {
        return [...this.values()].filter(e => e.isUpcoming).sort((a, b) => new Date(a.startTime) - new Date(b.startTime));
    }

    get past() {
        return [...this.values()].filter(e => e.isPast);
    }

    toArray() {
        return [...this.values()].map(e => ({
            id: e.id, name: e.name, description: e.description,
            location: e.location, startTime: e.startTime, endTime: e.endTime,
            createdBy: e.createdBy, createdAt: e.createdAt, attendees: e.attendees
        }));
    }
}

module.exports = EventManager;
