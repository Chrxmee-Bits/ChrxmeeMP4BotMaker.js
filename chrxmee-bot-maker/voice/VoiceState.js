class VoiceState {
    constructor(client, channel, data = {}) {
        this.client = client;
        this.channel = channel;
        this.participants = data.participants || [];
        this.currentDJ = data.currentDJ || null;
        this.currentVideo = data.currentVideo || null;
        this.queue = data.queue || [];
        this.isPlaying = data.isPlaying || false;
    }

    hasParticipant(username) {
        return this.participants.some(p => p.username === username && p.isAlive);
    }

    addParticipant(username) {
        if (!this.hasParticipant(username)) {
            this.participants.push({
                username,
                joinedAt: Date.now(),
                isAlive: true
            });
        } else {
            const p = this.participants.find(p => p.username === username);
            if (p) p.isAlive = true;
        }
    }

    removeParticipant(username) {
        const p = this.participants.find(p => p.username === username);
        if (p) {
            p.isAlive = false;
            setTimeout(() => {
                this.participants = this.participants.filter(p => p.isAlive);
                if (this.participants.length === 0) {
                    this.stopPlayback();
                }
            }, 10000);
        }
    }

    get aliveParticipants() {
        return this.participants.filter(p => p.isAlive);
    }

    get participantCount() {
        return this.aliveParticipants.length;
    }

    pause() {
        if (this.currentVideo && this.isPlaying) {
            this.currentVideo.timestamp = 0;
            this.isPlaying = false;
        }
    }

    resume() {
        if (this.currentVideo && !this.isPlaying) {
            this.currentVideo.startTime = Date.now();
            this.isPlaying = true;
        }
    }

    seek(seconds) {
        if (this.currentVideo) {
            this.currentVideo.timestamp = Math.max(0, (this.currentVideo.timestamp || 0) + seconds);
            this.currentVideo.startTime = Date.now();
        }
    }

    stopPlayback() {
        this.isPlaying = false;
        this.currentVideo = null;
    }

    setCurrentVideo(video) {
        this.currentVideo = {
            src: video.src || video.url,
            title: video.title || 'Untitled',
            id: video.id || '',
            startTime: Date.now(),
            timestamp: video.timestamp || 0
        };
        this.isPlaying = true;
    }

    toJSON() {
        return {
            participants: this.participants,
            currentDJ: this.currentDJ,
            currentVideo: this.currentVideo,
            queue: this.queue,
            isPlaying: this.isPlaying
        };
    }
}

module.exports = VoiceState;
