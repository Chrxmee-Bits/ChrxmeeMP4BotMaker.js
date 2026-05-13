const BaseManager = require('./BaseManager');
const GuildMember = require('../structures/GuildMember');

class GuildMemberManager extends BaseManager {
    constructor(client, guild, members) {
        super(client);
        this.guild = guild;
        if (members) {
            members.forEach(m => this.add(m));
        }
    }

    _createInstance(data) {
        return new GuildMember(this.client, this.guild, data);
    }

    async fetch(username) {
        const guilds = this.client.storage.getGuilds();
        const g = guilds.find(g => g.id === this.guild.id);
        if (!g) return null;
        const data = (g.members || []).find(m => m.username === username);
        if (!data) return null;
        return this.add(data);
    }

    async kick(username) {
        const guilds = this.client.storage.getGuilds();
        const g = guilds.find(g => g.id === this.guild.id);
        if (!g) return false;
        g.members = (g.members || []).filter(m => m.username !== username);
        this.client.storage.saveGuilds(guilds);
        this.delete(username);
        return true;
    }

    async ban(username) {
        await this.kick(username);
        const guilds = this.client.storage.getGuilds();
        const g = guilds.find(g => g.id === this.guild.id);
        if (g) {
            g.bannedUsers = g.bannedUsers || [];
            if (!g.bannedUsers.includes(username)) g.bannedUsers.push(username);
            this.client.storage.saveGuilds(guilds);
        }
        return true;
    }

    async setRole(username, role) {
        const guilds = this.client.storage.getGuilds();
        const g = guilds.find(g => g.id === this.guild.id);
        if (!g) return false;
        const member = (g.members || []).find(m => m.username === username);
        if (member) {
            member.role = role;
            this.client.storage.saveGuilds(guilds);
            const cached = this.get(username);
            if (cached) cached.role = role;
            return true;
        }
        return false;
    }

    get owner() {
        return [...this.values()].find(m => m.role === 'owner');
    }

    get admins() {
        return [...this.values()].filter(m => m.isAdmin);
    }

    get mods() {
        return [...this.values()].filter(m => m.isMod);
    }

    toArray() {
        return [...this.values()].map(m => ({
            username: m.username,
            role: m.role,
            joinedAt: m.joinedAt,
            nickname: m.nickname
        }));
    }
}

module.exports = GuildMemberManager;
