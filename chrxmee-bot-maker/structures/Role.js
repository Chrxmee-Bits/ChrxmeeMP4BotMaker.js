const Base = require('./Base');

class Role extends Base {
    constructor(client, guild, data) {
        super(client, data.name);
        this.guild = guild;
        this.name = data.name;
        this.color = data.color || '#888';
        this.permissions = data.permissions || [];
        this.locked = data.locked || false;
        this.hoist = data.hoist || false;
        this.position = data.position || 0;
    }

    get hexColor() {
        return this.color;
    }

    get members() {
        return [...this.guild.members.values()].filter(m => m.role === this.name);
    }

    get memberCount() {
        return this.members.length;
    }

    hasPermission(perm) {
        return this.permissions.includes('admin') || this.permissions.includes(perm);
    }

    async setPermissions(perms) {
        if (this.locked) throw new Error('Cannot modify a locked role.');
        this.permissions = perms;
        return this._save();
    }

    async setColor(color) {
        this.color = color;
        return this._save();
    }

    async setName(name) {
        this.name = name;
        return this._save();
    }

    async delete() {
        if (this.locked) throw new Error('Cannot delete a locked role.');
        return this.guild.roles.delete(this.name);
    }

    get editable() {
        return !this.locked;
    }

    toString() {
        return `@${this.name}`;
    }

    async _save() {
        const guilds = this.client.storage.getGuilds();
        const g = guilds.find(g => g.id === this.guild.id);
        if (!g) return;
        const roles = g.roles || [];
        const idx = roles.findIndex(r => r.name === this.name);
        if (idx !== -1) {
            roles[idx] = { name: this.name, color: this.color, permissions: this.permissions, locked: this.locked, hoist: this.hoist, position: this.position };
            this.client.storage.saveGuilds(guilds);
        }
    }
}

module.exports = Role;
