const Base = require('./Base');

class User extends Base {
    constructor(client, data) {
        super(client, data.username || data.id);
        this.username = data.username || data.id;
        this.displayName = data.displayName || this.username;
        this.avatar = data.avatar || data.avatarImage || '';
        this.avatarColor = data.avatarColor || '#e50914';
        this.bio = data.bio || '';
        this.badges = data.badges || [];
        this.createdAt = data.createdAt || null;
        this.lastOnline = parseInt(data.lastOnline || '0');
    }

    get isOnline() {
        return Date.now() - this.lastOnline < 3600000;
    }

    get profile() {
        return this.client.profiles.get(this.username);
    }

    async fetch() {
        const profiles = this.client.storage.getProfiles();
        const data = profiles[this.username];
        if (data) {
            this._patch({
                displayName: data.displayName,
                avatar: data.avatarImage || data.avatar,
                avatarColor: data.avatarColor,
                bio: data.bio,
                badges: data.badges || []
            });
        }
        return this;
    }

    async dm(content) {
        return this.client.sendDM(this.username, content);
    }

    async send(content) {
        return this.client.sendDM(this.username, content);
    }

    toString() {
        return `@${this.username}`;
    }

    get tag() {
        return this.username;
    }
}

module.exports = User;
