const Base = require('./Base');

class Comment extends Base {
    constructor(client, data) {
        super(client, data.id || 'cmt_' + Date.now().toString(36));
        this.videoId = data.videoId || '';
        this.authorId = data.author || data.from || '';
        this.content = data.text || data.content || '';
        this.timestamp = data.timestamp || Date.now();
        this.edited = data.edited || false;
        this.likes = data.likes || 0;
    }

    get author() {
        return this.client.users.get(this.authorId);
    }

    get video() {
        return this.client.videos.get(this.videoId);
    }

    async reply(content) {
        const comments = this.client.storage.getComments();
        const reply = {
            id: 'cmt_' + Date.now().toString(36),
            videoId: this.videoId,
            author: this.client.user.id,
            text: content,
            timestamp: Date.now(),
            edited: false,
            likes: 0,
            parentId: this.id
        };
        comments.push(reply);
        this.client.storage.saveComments(comments);
        return new Comment(this.client, reply);
    }

    async edit(content) {
        const comments = this.client.storage.getComments();
        const cmt = comments.find(c => c.id === this.id);
        if (cmt) {
            cmt.text = content;
            cmt.edited = true;
            this.client.storage.saveComments(comments);
            this.content = content;
            this.edited = true;
        }
        return this;
    }

    async delete() {
        const comments = this.client.storage.getComments();
        const filtered = comments.filter(c => c.id !== this.id);
        this.client.storage.saveComments(filtered);
        return true;
    }

    async like() {
        this.likes++;
        return this._save();
    }

    async _save() {
        const comments = this.client.storage.getComments();
        const idx = comments.findIndex(c => c.id === this.id);
        if (idx !== -1) {
            comments[idx].likes = this.likes;
            this.client.storage.saveComments(comments);
        }
    }
}

module.exports = Comment;
