const Base = require('./Base');

class Invite extends Base {
    constructor(client, guild, data) {
        super(client, data.code);
        this.guild = guild;
        this.code = data.code;
        this.active = data.active !== false;
        this.createdBy = data.createdBy || '';
        this.createdAt = data.createdAt || new Date().toISOString();
        this.uses = data.uses || 0;
        this.maxUses = data.maxUses || 0;
        this.expires = data.expires || null;
    }

    get url() {
        return `https://chrxmee-mp4-player.vercel.app/guild?invite=${this.code}`;
    }

    get isExpired() {
        if (!this.expires) return false;
        return new Date(this.expires) < new Date();
    }

    get isMaxed() {
        if (this.maxUses === 0) return false;
        return this.uses >= this.maxUses;
    }

    get isValid() {
        return this.active && !this.isExpired && !this.isMaxed;
    }

    async delete() {
        return this.guild.invites.delete(this.code);
    }

    toString() {
        return this.url;
    }
}

module.exports = Invite;
