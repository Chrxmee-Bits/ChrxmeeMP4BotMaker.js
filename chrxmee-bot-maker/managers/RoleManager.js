const BaseManager = require('./BaseManager');
const Role = require('../structures/Role');
const Constants = require('../util/Constants');

class RoleManager extends BaseManager {
    constructor(client, guild, roles) {
        super(client);
        this.guild = guild;

        // Always include default roles
        const allRoles = [...(roles || [])];
        for (const [key, def] of Object.entries(Constants.DEFAULT_ROLES)) {
            if (!allRoles.find(r => r.name === def.name)) {
                allRoles.push({ ...def, locked: true });
            }
        }

        allRoles.forEach(r => this.add(r));
    }

    _createInstance(data) {
        return new Role(this.client, this.guild, data);
    }

    async create(name, options = {}) {
        const role = {
            name,
            color: options.color || '#888',
            permissions: options.permissions || [],
            locked: options.locked || false,
            hoist: options.hoist || false,
            position: options.position || this.size
        };

        const guilds = this.client.storage.getGuilds();
        const g = guilds.find(g => g.id === this.guild.id);
        if (g) {
            g.roles = g.roles || [];
            g.roles.push(role);
            this.client.storage.saveGuilds(guilds);
            return this.add(role);
        }
        return null;
    }

    async delete(name) {
        const guilds = this.client.storage.getGuilds();
        const g = guilds.find(g => g.id === this.guild.id);
        if (g) {
            g.roles = (g.roles || []).filter(r => r.name !== name);
            this.client.storage.saveGuilds(guilds);
        }
        this.delete(name);
        return true;
    }

    toArray() {
        return [...this.values()]
            .filter(r => !Object.values(Constants.DEFAULT_ROLES).some(d => d.name === r.name && d.locked))
            .map(r => ({
                name: r.name,
                color: r.color,
                permissions: r.permissions,
                locked: r.locked,
                hoist: r.hoist,
                position: r.position
            }));
    }
}

module.exports = RoleManager;
