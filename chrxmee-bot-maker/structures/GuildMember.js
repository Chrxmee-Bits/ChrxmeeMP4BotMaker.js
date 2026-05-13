const Base = require('./Base');

class GuildMember extends Base {
    constructor(client, guild, data) {
        super(client, data.username);
        this.guild = guild;
        this.username = data.username;
        this.role = data.role || 'member';
        this.joinedAt = data.joinedAt || new Date().toISOString();
        this.nickname = data.nickname || null;
    }

    get user() {
        return this.client.users.get(this.username);
    }

    get displayName() {
        return this.nickname || (this.user ? this.user.displayName : this.username);
    }

    get permissions() {
        const roleDef = this.guild.roles.get(this.role);
        if (roleDef) return roleDef.permissions;
        const defaults = this.client.Constants.DEFAULT_ROLES;
        const def = defaults[this.role];
        return def ? def.permissions : [];
    }

    get isOwner() {
        return this.guild.ownerId === this.username;
    }

    get isAdmin() {
        return this.isOwner || this.role === 'admin' || this.hasPermission('admin');
    }

    get isMod() {
        return this.isAdmin || this.role === 'mod' || this.hasPermission('manage_messages');
    }

    hasPermission(perm) {
        if (this.isOwner) return true;
        if (perm === 'admin') return false;
        return this.permissions.includes('admin') || this.permissions.includes(perm);
    }

    async kick() {
        return this.guild.members.kick(this.username);
    }

    async ban() {
        return this.guild.members.ban(this.username);
    }

    async setRole(role) {
        this.role = role;
        return this.guild.members.setRole(this.username, role);
    }

    async setNickname(nick) {
        this.nickname = nick;
        return this._save();
    }

    async mute() {
        return this.guild.mute(this.username);
    }

    async unmute() {
        return this.guild.unmute(this.username);
    }

    get isMuted() {
        return this.guild.mutedUsers.includes(this.username);
    }

    get isBanned() {
        return this.guild.bannedUsers.includes(this.username);
    }

    async _save() {
        const guilds = this.client.storage.getGuilds();
        const g = guilds.find(g => g.id === this.guild.id);
        if (!g) return;
        const member = (g.members || []).find(m => m.username === this.username);
        if (member) {
            member.nickname = this.nickname;
            member.role = this.role;
            this.client.storage.saveGuilds(guilds);
        }
    }
}

module.exports = GuildMember;
