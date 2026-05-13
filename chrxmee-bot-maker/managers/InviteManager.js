const BaseManager = require('./BaseManager');
const Invite = require('../structures/Invite');

class InviteManager extends BaseManager {
    constructor(client, guild, invites) {
        super(client);
        this.guild = guild;
        if (invites) {
            invites.forEach(i => this.add(i));
        }
    }

    _createInstance(data) {
        return new Invite(this.client, this.guild, data);
    }

    async create(options = {}) {
        const code = 'inv_' + Date.now().toString(36);
        const invite = {
            code,
            active: true,
            createdBy: this.client.user.id,
            createdAt: new Date().toISOString(),
            uses: 0,
            maxUses: options.maxUses || 0,
            expires: options.expires || null
        };

        const guilds = this.client.storage.getGuilds();
        const g = guilds.find(g => g.id === this.guild.id);
        if (g) {
            g.invites = g.invites || [];
            g.invites.push(invite);
            this.client.storage.saveGuilds(guilds);
            return this.add(invite);
        }
        return null;
    }

    async delete(code) {
        const guilds = this.client.storage.getGuilds();
        const g = guilds.find(g => g.id === this.guild.id);
        if (g) {
            g.invites = (g.invites || []).filter(i => i.code !== code);
            this.client.storage.saveGuilds(guilds);
        }
        this.delete(code);
        return true;
    }

    toArray() {
        return [...this.values()].map(i => ({
            code: i.code,
            active: i.active,
            createdBy: i.createdBy,
            createdAt: i.createdAt,
            uses: i.uses,
            maxUses: i.maxUses,
            expires: i.expires
        }));
    }
}

module.exports = InviteManager;
