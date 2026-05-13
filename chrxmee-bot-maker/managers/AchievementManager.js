const BaseManager = require('./BaseManager');
const Achievement = require('../structures/Achievement');
const Constants = require('../util/Constants');

class AchievementManager extends BaseManager {
    constructor(client, guild, unlockedIds) {
        super(client);
        this.guild = guild;
        const unlocked = unlockedIds || [];

        Constants.GUILD_ACHIEVEMENTS.forEach(ach => {
            this.add({
                ...ach,
                unlockedAt: unlocked.includes(ach.id) ? Date.now() : null
            });
        });
    }

    _createInstance(data) {
        return new Achievement(this.client, this.guild, data);
    }

    get unlocked() {
        return [...this.values()].filter(a => a.isUnlocked);
    }

    get locked() {
        return [...this.values()].filter(a => !a.isUnlocked);
    }

    get totalCount() {
        return this.size;
    }

    get unlockedCount() {
        return this.unlocked.length;
    }

    toArray() {
        return this.unlocked.map(a => a.id);
    }
}

module.exports = AchievementManager;
