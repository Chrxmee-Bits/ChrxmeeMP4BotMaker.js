const Base = require('./Base');

class Video extends Base {
    constructor(client, data) {
        super(client, data.id || 'vid_' + Date.now().toString(36));
        this.title = data.title || 'Untitled';
        this.description = data.description || '';
        this.url = data.url || data.src || '';
        this.thumbnail = data.thumbnail || '';
        this.duration = data.duration || 0;
        this.uploader = data.uploader || data.uploadedBy || '';
        this.uploadedAt = data.uploadedAt || data.createdAt || new Date().toISOString();
        this.views = data.views || 0;
        this.likes = data.likes || 0;
        this.tags = data.tags || [];
        this.category = data.category || '';
        this.isPublic = data.isPublic !== false;
    }

    get uploaderUser() {
        return this.client.users.get(this.uploader);
    }

    get comments() {
        return this.client.comments.forVideo(this.id);
    }

    get formattedDuration() {
        return this.client.Utils.formatDuration(this.duration);
    }

    get formattedViews() {
        return this.client.Utils.formatNumber(this.views);
    }

    async fetch() {
        const videos = this.client.storage.getPublicLibrary();
        const data = videos.find(v => v.id === this.id || v.url === this.url);
        if (data) this._patch(data);
        return this;
    }

    async delete() {
        const videos = this.client.storage.getPublicLibrary();
        const filtered = videos.filter(v => v.id !== this.id && v.url !== this.url);
        this.client.storage.savePublicLibrary(filtered);
        return true;
    }

    toString() {
        return this.title;
    }
}

module.exports = Video;
