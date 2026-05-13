class VoiceQueue {
    constructor(client, channel, data = {}) {
        this.client = client;
        this.channel = channel;
        this.queue = data.queue || [];
    }

    get length() {
        return this.queue.length;
    }

    get isEmpty() {
        return this.queue.length === 0;
    }

    get current() {
        return this.channel.voiceState.currentVideo;
    }

    get upcoming() {
        return [...this.queue];
    }

    add(video) {
        const entry = {
            src: video.src || video.url,
            title: video.title || 'Untitled',
            id: video.id || 'vid_' + Date.now().toString(36),
            thumbnail: video.thumbnail || '',
            addedBy: this.client.user.id,
            addedAt: Date.now()
        };
        this.queue.push(entry);
        this.channel.voiceState.queue = this.queue;
        return entry;
    }

    remove(index) {
        if (index >= 0 && index < this.queue.length) {
            const removed = this.queue.splice(index, 1)[0];
            this.channel.voiceState.queue = this.queue;
            return removed;
        }
        return null;
    }

    playNext() {
        if (this.queue.length === 0) {
            this.channel.voiceState.stopPlayback();
            return null;
        }
        const next = this.queue.shift();
        this.channel.voiceState.setCurrentVideo(next);
        this.channel.voiceState.queue = this.queue;
        return next;
    }

    skip() {
        return this.playNext();
    }

    clear() {
        this.queue = [];
        this.channel.voiceState.queue = [];
        this.channel.voiceState.stopPlayback();
    }

    reorder(fromIndex, toIndex) {
        if (fromIndex >= 0 && fromIndex < this.queue.length &&
            toIndex >= 0 && toIndex < this.queue.length) {
            const item = this.queue.splice(fromIndex, 1)[0];
            this.queue.splice(toIndex, 0, item);
            this.channel.voiceState.queue = this.queue;
            return true;
        }
        return false;
    }

    toArray() {
        return [...this.queue];
    }
}

module.exports = VoiceQueue;
