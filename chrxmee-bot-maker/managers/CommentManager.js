const BaseManager = require('./BaseManager');
const Comment = require('../structures/Comment');

class CommentManager extends BaseManager {
    constructor(client) {
        super(client);
    }

    _createInstance(data) {
        return new Comment(this.client, data);
    }

    forVideo(videoId) {
        const comments = this.client.storage.getComments();
        const videoComments = comments.filter(c => c.videoId === videoId);
        videoComments.forEach(c => this.add(c));
        return [...this.values()].filter(c => c.videoId === videoId);
    }

    async create(videoId, content) {
        const comment = {
            id: 'cmt_' + Date.now().toString(36),
            videoId,
            author: this.client.user.id,
            text: content,
            timestamp: Date.now(),
            edited: false,
            likes: 0
        };
        const comments = this.client.storage.getComments();
        comments.push(comment);
        this.client.storage.saveComments(comments);
        return this.add(comment);
    }

    async fetch(id) {
        const comments = this.client.storage.getComments();
        const data = comments.find(c => c.id === id);
        if (!data) return null;
        return this.add(data);
    }

    async delete(id) {
        const comments = this.client.storage.getComments();
        const filtered = comments.filter(c => c.id !== id);
        this.client.storage.saveComments(filtered);
        this.delete(id);
        return true;
    }
}

module.exports = CommentManager;
