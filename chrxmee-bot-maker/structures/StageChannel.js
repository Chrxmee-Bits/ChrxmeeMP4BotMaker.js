const VoiceChannel = require('./VoiceChannel');

class StageChannel extends VoiceChannel {
    constructor(client, guild, data) {
        super(client, guild, data);
        this.type = 'stage';
        this.speakers = data.speakers || [];
        this.speakerRequests = data.speakerRequests || [];
    }

    get isSpeaker() {
        return this.speakers.includes(this.client.user.id);
    }

    async requestToSpeak() {
        if (this.isSpeaker) return true;
        if (this.speakerRequests.includes(this.client.user.id)) return false;
        this.speakerRequests.push(this.client.user.id);
        return this._save();
    }

    async cancelRequest() {
        this.speakerRequests = this.speakerRequests.filter(u => u !== this.client.user.id);
        return this._save();
    }

    async promoteToSpeaker(username) {
        if (!this.speakers.includes(username)) {
            this.speakers.push(username);
            this.speakerRequests = this.speakerRequests.filter(u => u !== username);
        }
        return this._save();
    }

    async demoteSpeaker(username) {
        this.speakers = this.speakers.filter(u => u !== username);
        return this._save();
    }

    get audience() {
        return this.participants.filter(p => !this.speakers.includes(p.username));
    }

    get speakersList() {
        return this.participants.filter(p => this.speakers.includes(p.username));
    }
}

module.exports = StageChannel;
