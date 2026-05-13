const Base = require('./Base');

class Notification extends Base {
    constructor(client, data) {
        super(client, data.id || 'notif_' + Date.now().toString(36));
        this.userId = data.userId || data.to || '';
        this.type = data.type || 'info'; // info, mention, dm, system, guild, video
        this.title = data.title || '';
        this.body = data.body || data.text || '';
        this.icon = data.icon || '🔔';
        this.read = data.read || false;
        this.timestamp = data.timestamp || Date.now();
        this.actionUrl = data.actionUrl || data.url || '';
        this.fromId = data.from || data.fromId || '';
    }

    get user() {
        return this.client.users.get(this.userId);
    }

    get from() {
        return this.client.users.get(this.fromId);
    }

    async markRead() {
        this.read = true;
        return this._save();
    }

    async markUnread() {
        this.read = false;
        return this._save();
    }

    async delete() {
        const notifications = this.client.storage.getNotifications();
        const filtered = notifications.filter(n => n.id !== this.id);
        this.client.storage.saveNotifications(filtered);
        return true;
    }

    async _save() {
        const notifications = this.client.storage.getNotifications();
        const idx = notifications.findIndex(n => n.id === this.id);
        if (idx !== -1) {
            notifications[idx].read = this.read;
            this.client.storage.saveNotifications(notifications);
        }
    }
}

module.exports = Notification;
