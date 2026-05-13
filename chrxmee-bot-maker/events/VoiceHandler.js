class VoiceHandler {
    constructor(client) {
        this.client = client;
        this.lastStates = new Map();
        this.checkInterval = null;
    }

    check() {
        if (!this.client.connected) return;

        for (const [, guild] of this.client.guilds) {
            for (const [, channel] of guild.channels) {
                if (channel.type !== 'voice' && channel.type !== 'stage') continue;
                if (!channel.voiceState) continue;

                const key = `${guild.id}_${channel.id}`;
                const currentState = channel.voiceState.toJSON();
                const lastState = this.lastStates.get(key);

                if (!lastState) {
                    this.lastStates.set(key, JSON.parse(JSON.stringify(currentState)));
                    continue;
                }

                // Check for new participants
                const currentParticipants = currentState.participants.filter(p => p.isAlive);
                const lastParticipants = lastState.participants.filter(p => p.isAlive);
                const currentIds = currentParticipants.map(p => p.username);
                const lastIds = lastParticipants.map(p => p.username);

                // Joined
                const joined = currentIds.filter(id => !lastIds.includes(id));
                for (const username of joined) {
                    const user = this.client.users.get(username);
                    this.client.emit('voiceJoin', channel, user || username);
                }

                // Left
                const left = lastIds.filter(id => !currentIds.includes(id));
                for (const username of left) {
                    const user = this.client.users.get(username);
                    this.client.emit('voiceLeave', channel, user || username);
                }

                // DJ changed
                if (currentState.currentDJ !== lastState.currentDJ) {
                    const oldDJ = lastState.currentDJ;
                    const newDJ = currentState.currentDJ;
                    this.client.emit('voiceDJChange', channel, oldDJ, newDJ);
                }

                // Video started
                if (currentState.currentVideo && !lastState.currentVideo) {
                    this.client.emit('voiceVideoStart', channel, currentState.currentVideo);
                }

                // Video stopped
                if (!currentState.currentVideo && lastState.currentVideo) {
                    this.client.emit('voiceVideoEnd', channel, lastState.currentVideo);
                }

                // Video changed
                if (currentState.currentVideo && lastState.currentVideo &&
                    currentState.currentVideo.id !== lastState.currentVideo.id) {
                    this.client.emit('voiceVideoChange', channel, currentState.currentVideo, lastState.currentVideo);
                }

                // Queue updated
                if (JSON.stringify(currentState.queue) !== JSON.stringify(lastState.queue)) {
                    this.client.emit('voiceQueueUpdate', channel, currentState.queue);
                }

                this.lastStates.set(key, JSON.parse(JSON.stringify(currentState)));
            }
        }
    }
}

module.exports = VoiceHandler;
