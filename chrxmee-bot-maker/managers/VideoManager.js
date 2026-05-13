const BaseManager = require('./BaseManager');
const Video = require('../structures/Video');

class VideoManager extends BaseManager {
    constructor(client) {
        super(client);
    }

    _createInstance(data) {
        return new Video(this.client, data);
    }

    async fetch(id) {
        const videos = this.client.storage.getPublicLibrary();
        const data = videos.find(v => v.id === id);
        if (!data) return null;
        return this.add(data);
    }

    async fetchAll() {
        const videos = this.client.storage.getPublicLibrary();
        videos.forEach(v => this.add(v));
        return this;
    }

    async search(query) {
        const videos = this.client.storage.getPublicLibrary();
        const results = videos.filter(v =>
            (v.title || '').toLowerCase().includes(query.toLowerCase()) ||
            (v.description || '').toLowerCase().includes(query.toLowerCase()) ||
            (v.tags || []).some(t => t.toLowerCase().includes(query.toLowerCase()))
        );
        results.forEach(v => this.add(v));
        return results.map(v => this.get(v.id));
    }

    async upload(metadata) {
        const video = {
            id: 'vid_' + Date.now().toString(36),
            title: metadata.title || 'Untitled',
            description: metadata.description || '',
            url: metadata.url || metadata.src || '',
            thumbnail: metadata.thumbnail || '',
            duration: metadata.duration || 0,
            uploader: this.client.user.id,
            uploadedAt: new Date().toISOString(),
            views: 0,
            likes: 0,
            tags: metadata.tags || [],
            category: metadata.category || '',
            isPublic: metadata.isPublic !== false
        };

        const videos = this.client.storage.getPublicLibrary();
        videos.push(video);
        this.client.storage.savePublicLibrary(videos);
        return this.add(video);
    }

    async delete(id) {
        const videos = this.client.storage.getPublicLibrary();
        const filtered = videos.filter(v => v.id !== id);
        this.client.storage.savePublicLibrary(filtered);
        this.delete(id);
        return true;
    }

    get trending() {
        return [...this.values()]
            .sort((a, b) => b.views - a.views)
            .slice(0, 10);
    }

    get recent() {
        return [...this.values()]
            .sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt))
            .slice(0, 10);
    }
}

module.exports = VideoManager;
