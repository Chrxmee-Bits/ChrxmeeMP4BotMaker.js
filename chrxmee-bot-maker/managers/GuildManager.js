const BaseManager = require('./BaseManager');
const Guild = require('../structures/Guild');

class GuildManager extends BaseManager {
    constructor(client) {
        super(client);
    }

    _createInstance(data) {
        return new Guild(this.client, data);
    }

    async fetch(id) {
        const guilds = this.client.storage.getGuilds();
        const data = guilds.find(g => g.id === id);
        if (!data) return null;
        const guild = this.add(data);
        return guild;
    }

    async fetchAll() {
        const guilds = this.client.storage.getGuilds();
        const botGuilds = guilds.filter(g =>
            g.members && g.members.some(m => m.username === this.client.user.id)
        );
        botGuilds.forEach(data => this.add(data));
        return this;
    }

    async create(name, options = {}) {
        const guild = {
            id: 'guild_' + Date.now().toString(36),
            name,
            owner: this.client.user.id,
            type: options.type || 'public',
            category: options.category || 'other',
            description: options.description || '',
            accent: options.accent || '#e50914',
            theme: options.theme || 'dark',
            icon: options.icon || '',
            banner: options.banner || '',
            createdAt: new Date().toISOString(),
            members: [{ username: this.client.user.id, role: 'owner', joinedAt: new Date().toISOString() }],
            mods: [],
            bannedUsers: [],
            mutedUsers: [],
            roles: [],
            invites: [],
            categories: [{
                id: 'cat_' + Date.now().toString(36),
                name: 'General',
                channels: [{
                    id: 'ch_' + Date.now().toString(36),
                    name: 'general',
                    type: 'text',
                    topic: '',
                    slowMode: 0,
                    messages: []
                }]
            }],
            feed: [],
            streak: 0,
            lastActiveDate: new Date().toDateString(),
            watchParty: null,
            tvSchedule: [],
            activeTV: null,
            achievements: [],
            events: []
        };

        const guilds = this.client.storage.getGuilds();
        guilds.push(guild);
        this.client.storage.saveGuilds(guilds);

        return this.add(guild);
    }

    async delete(id) {
        const guilds = this.client.storage.getGuilds();
        const filtered = guilds.filter(g => g.id !== id);
        this.client.storage.saveGuilds(filtered);
        this.delete(id);
    }
}

module.exports = GuildManager;
