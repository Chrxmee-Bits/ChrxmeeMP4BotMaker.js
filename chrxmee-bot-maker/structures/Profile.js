const Base = require('./Base');

class Profile extends Base {
    constructor(client, data) {
        super(client, data.username);
        this.username = data.username;
        this.displayName = data.displayName || data.username;
        this.avatarImage = data.avatarImage || '';
        this.avatarColor = data.avatarColor || '#e50914';
        this.bio = data.bio || '';
        this.badges = data.badges || [];
        this.createdAt = data.createdAt || null;
        this.subscribers = data.subscribers || 0;
        this.totalViews = data.totalViews || 0;
        this.totalUploads = data.totalUploads || 0;
    }

    get user() {
        return this.client.users.get(this.username);
    }

    get isOnline() {
        const last = parseInt(
            this.client.storage.getRaw('chrxmeemp4_last_online_' + this.username) || '0'
        );
        return Date.now() - last < 3600000;
    }

    async fetch() {
        const profiles = this.client.storage.getProfiles();
        const data = profiles[this.username];
        if (data) this._patch(data);
        return this;
    }

    async setBio(bio) {
        const profiles = this.client.storage.getProfiles();
        if (profiles[this.username]) {
            profiles[this.username].bio = bio;
            this.client.storage.saveProfiles(profiles);
            this.bio = bio;
        }
    }

    async setDisplayName(name) {
        const profiles = this.client.storage.getProfiles();
        if (profiles[this.username]) {
            profiles[this.username].displayName = name;
            this.client.storage.saveProfiles(profiles);
            this.displayName = name;
        }
    }
}

module.exports = Profile;
