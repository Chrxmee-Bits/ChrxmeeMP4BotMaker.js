const Base = require('./Base');

class Achievement extends Base {
    constructor(client, guild, data) {
        super(client, data.id);
        this.guild = guild;
        this.name = data.name || '';
        this.icon = data.icon || '🏆';
        this.description = data.desc || data.description || '';
        this.unlockedAt = data.unlockedAt || null;
    }

    get isUnlocked() {
        return this.unlockedAt !== null;
    }

    get unlockedDate() {
        return this.unlockedAt ? new Date(this.unlockedAt) : null;
    }
}

module.exports = Achievement;
