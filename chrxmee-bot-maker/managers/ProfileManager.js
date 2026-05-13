const BaseManager = require('./BaseManager');
const Profile = require('../structures/Profile');

class ProfileManager extends BaseManager {
    constructor(client) {
        super(client);
    }

    _createInstance(data) {
        return new Profile(this.client, data);
    }

    async fetch(username) {
        const profiles = this.client.storage.getProfiles();
        const data = profiles[username];
        if (!data) return null;
        return this.add({ ...data, username });
    }

    async fetchAll() {
        const profiles = this.client.storage.getProfiles();
        for (const [username, data] of Object.entries(profiles)) {
            this.add({ ...data, username });
        }
        return this;
    }

    async update(username, updates) {
        const profiles = this.client.storage.getProfiles();
        if (profiles[username]) {
            profiles[username] = { ...profiles[username], ...updates };
            this.client.storage.saveProfiles(profiles);
            const cached = this.get(username);
            if (cached) cached._patch({ ...updates, username });
            return this.get(username);
        }
        return null;
    }

    get topUploaders() {
        return [...this.values()]
            .sort((a, b) => (b.totalUploads || 0) - (a.totalUploads || 0))
            .slice(0, 10);
    }
}

module.exports = ProfileManager;
