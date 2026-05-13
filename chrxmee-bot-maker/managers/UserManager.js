const BaseManager = require('./BaseManager');
const User = require('../structures/User');

class UserManager extends BaseManager {
    constructor(client) {
        super(client);
    }

    _createInstance(data) {
        return new User(this.client, data);
    }

    async fetch(username) {
        const profiles = this.client.storage.getProfiles();
        const profile = profiles[username];
        if (!profile) {
            // Create minimal user from username alone
            return this.add({ username });
        }
        const lastOnline = this.client.storage.getRaw('chrxmeemp4_last_online_' + username);
        return this.add({
            username,
            displayName: profile.displayName,
            avatarImage: profile.avatarImage,
            avatarColor: profile.avatarColor,
            bio: profile.bio,
            badges: profile.badges,
            createdAt: profile.createdAt,
            lastOnline: parseInt(lastOnline || '0')
        });
    }

    async fetchAll() {
        const profiles = this.client.storage.getProfiles();
        for (const [username, profile] of Object.entries(profiles)) {
            const lastOnline = this.client.storage.getRaw('chrxmeemp4_last_online_' + username);
            this.add({
                username,
                displayName: profile.displayName,
                avatarImage: profile.avatarImage,
                avatarColor: profile.avatarColor,
                bio: profile.bio,
                badges: profile.badges,
                createdAt: profile.createdAt,
                lastOnline: parseInt(lastOnline || '0')
            });
        }
        return this;
    }

    get online() {
        return [...this.values()].filter(u => u.isOnline);
    }
}

module.exports = UserManager;
