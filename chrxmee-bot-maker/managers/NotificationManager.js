const BaseManager = require('./BaseManager');
const Notification = require('../structures/Notification');

class NotificationManager extends BaseManager {
    constructor(client) {
        super(client);
    }

    _createInstance(data) {
        return new Notification(this.client, data);
    }

    async fetchAll() {
        const notifications = this.client.storage.getNotifications();
        const mine = notifications.filter(n => n.userId === this.client.user.id || n.to === this.client.user.id);
        mine.forEach(n => this.add(n));
        return this;
    }

    async send(userId, options = {}) {
        const notification = {
            id: 'notif_' + Date.now().toString(36),
            userId,
            type: options.type || 'info',
            title: options.title || '',
            body: options.body || options.text || '',
            icon: options.icon || '🔔',
            read: false,
            timestamp: Date.now(),
            actionUrl: options.actionUrl || options.url || '',
            from: this.client.user.id
        };
        const notifications = this.client.storage.getNotifications();
        notifications.push(notification);
        this.client.storage.saveNotifications(notifications);
        return this.add(notification);
    }

    get unread() {
        return [...this.values()].filter(n => !n.read);
    }

    get read() {
        return [...this.values()].filter(n => n.read);
    }

    async markAllRead() {
        for (const [, n] of this) {
            await n.markRead();
        }
    }

    async clearAll() {
        const notifications = this.client.storage.getNotifications();
        const filtered = notifications.filter(n => n.userId !== this.client.user.id && n.to !== this.client.user.id);
        this.client.storage.saveNotifications(filtered);
        this.clear();
    }
}

module.exports = NotificationManager;
