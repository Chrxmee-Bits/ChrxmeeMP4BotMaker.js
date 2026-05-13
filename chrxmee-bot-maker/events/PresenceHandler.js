class PresenceHandler {
    constructor(client) {
        this.client = client;
        this.lastPresence = null;
        this.lastActivityUpdate = 0;
    }

    check() {
        if (!this.client.connected) return;

        const bots = this.client.storage.getBots();
        const bot = bots.find(b => b.id === this.client.user.id);
        if (!bot || !bot.presence) return;

        const presence = bot.presence;

        // Activity changed
        if (this.lastPresence) {
            const lastActivity = this.lastPresence.activity;
            const currentActivity = presence.activity;

            if (JSON.stringify(lastActivity) !== JSON.stringify(currentActivity)) {
                this.client.emit('activityChange', currentActivity, lastActivity);
            }

            if (this.lastPresence.status !== presence.status) {
                this.client.emit('statusChange', presence.status, this.lastPresence.status);
            }
        }

        this.lastPresence = JSON.parse(JSON.stringify(presence));

        // Update activity timestamp
        if (presence.activity && Date.now() - this.lastActivityUpdate > 60000) {
            this.lastActivityUpdate = Date.now();
            this.client._updatePresence();
        }
    }
}

module.exports = PresenceHandler;
