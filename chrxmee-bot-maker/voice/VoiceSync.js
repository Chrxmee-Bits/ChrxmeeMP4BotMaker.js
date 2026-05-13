class VoiceSync {
    constructor(client, channel) {
        this.client = client;
        this.channel = channel;
        this.syncInterval = null;
        this.djCheckInterval = null;
        this.isDJ = false;
    }

    start() {
        this.stop();
        this.isDJ = this.channel.dj.isCurrentUserDJ;

        this.syncInterval = setInterval(() => {
            if (!this.channel || !this.channel.voiceState) return;

            const vcState = this.channel.voiceState;

            if (this.isDJ && vcState.currentVideo && vcState.isPlaying) {
                vcState.currentVideo.timestamp = this._getCurrentTimestamp();
                vcState.currentVideo.startTime = Date.now();
            }

            if (!this.isDJ && vcState.currentVideo && vcState.isPlaying) {
                this._syncToDJ();
            }
        }, 2000);

        this.djCheckInterval = setInterval(() => {
            if (!this.channel || !this.channel.voiceState) return;

            const vcState = this.channel.voiceState;
            const djName = vcState.currentDJ;
            const dj = vcState.aliveParticipants.find(
                p => p.username === djName
            );

            if (!dj && vcState.aliveParticipants.length > 0) {
                this.channel.dj.assignNext();
            }

            this.isDJ = this.channel.dj.isCurrentUserDJ;
        }, 5000);
    }

    stop() {
        if (this.syncInterval) clearInterval(this.syncInterval);
        if (this.djCheckInterval) clearInterval(this.djCheckInterval);
        this.syncInterval = null;
        this.djCheckInterval = null;
    }

    _getCurrentTimestamp() {
        return 0;
    }

    _syncToDJ() {
        const video = this.channel.voiceState.currentVideo;
        if (!video) return;
        const elapsed = (Date.now() - video.startTime) / 1000;
        const syncTime = (video.timestamp || 0) + elapsed;
        video.timestamp = syncTime;
    }

    getSyncPosition() {
        const video = this.channel.voiceState.currentVideo;
        if (!video || !video.startTime) return 0;
        const elapsed = (Date.now() - video.startTime) / 1000;
        return (video.timestamp || 0) + elapsed;
    }
}

module.exports = VoiceSync;
