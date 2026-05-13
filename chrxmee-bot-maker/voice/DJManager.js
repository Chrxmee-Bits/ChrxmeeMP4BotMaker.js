class DJManager {
    constructor(client, channel, data = {}) {
        this.client = client;
        this.channel = channel;
    }

    get current() {
        const djName = this.channel.voiceState.currentDJ;
        if (!djName) return null;
        const participant = this.channel.voiceState.aliveParticipants.find(
            p => p.username === djName
        );
        if (!participant) return null;
        return {
            id: participant.username,
            username: participant.username,
            user: this.client.users.get(participant.username),
            joinedAt: participant.joinedAt
        };
    }

    assign(username) {
        const oldDJ = this.channel.voiceState.currentDJ;
        this.channel.voiceState.currentDJ = username;
        if (oldDJ !== username) {
            this.client.emit('voiceDJChange', this.channel, oldDJ, username);
        }
    }

    assignNext() {
        const alive = this.channel.voiceState.aliveParticipants;
        if (alive.length === 0) {
            this.channel.voiceState.currentDJ = null;
            return;
        }
        const currentDJName = this.channel.voiceState.currentDJ;
        const currentIndex = alive.findIndex(p => p.username === currentDJName);
        const nextIndex = (currentIndex + 1) % alive.length;
        this.assign(alive[nextIndex].username);
    }

    assignRandom() {
        const alive = this.channel.voiceState.aliveParticipants;
        if (alive.length === 0) {
            this.channel.voiceState.currentDJ = null;
            return;
        }
        const random = alive[Math.floor(Math.random() * alive.length)];
        this.assign(random.username);
    }

    rotate() {
        this.assignNext();
    }

    get isCurrentUserDJ() {
        const dj = this.current;
        return dj ? dj.id === this.client.user.id : false;
    }

    get queue() {
        return [...this.channel.voiceState.queue];
    }
}

module.exports = DJManager;
