class NotificationHandler {
    constructor(client) {
        this.client = client;
        this.lastNotificationIds = new Set();
    }

    check() {
        if (!this.client.connected) return;

        const notifications = this.client.storage.getNotifications();
        const mine = notifications.filter(n =>
            n.userId === this.client.user.id || n.to === this.client.user.id
        );

        const currentIds = new Set(mine.map(n => n.id));
        const newIds = [...currentIds].filter(id => !this.lastNotificationIds.has(id));

        for (const id of newIds) {
            const notification = mine.find(n => n.id === id);
            if (notification && !notification.read) {
                this.client.emit('notification', notification);
                this.client.notifications.add(notification);
            }
        }

        this.lastNotificationIds = currentIds;

        // Cleanup
        if (this.lastNotificationIds.size > 500) {
            const arr = [...this.lastNotificationIds];
            this.lastNotificationIds = new Set(arr.slice(-250));
        }
    }
}

module.exports = NotificationHandler;
