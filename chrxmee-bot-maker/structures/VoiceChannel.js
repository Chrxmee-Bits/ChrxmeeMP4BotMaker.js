const GuildChannel = require('./GuildChannel');
const VoiceState = require('../voice/VoiceState');
const VoiceQueue = require('../voice/VoiceQueue');
const DJManager = require('../voice/DJManager');
const VoiceError = require('../errors/VoiceError');

class VoiceChannel extends GuildChannel {
    constructor(client, guild, data) {
        super(client, guild, data);
        this.type = 'voice';

        const vcData = data.vcState || {
            participants: [],
            currentDJ: null,
            currentVideo: null,
            queue: [],
            isPlaying: false
        };

        this.voiceState = new VoiceState(client, this, vcData);
        this.queue = new VoiceQueue(client, this, vcData);
        this.dj = new DJManager(client, this, vcData);
    }

    get participants() {
        return this.voiceState.participants;
    }

    get currentDJ() {
        return this.dj.current;
    }

    get isPlaying() {
        return this.voiceState.isPlaying;
    }

    get currentVideo() {
        return this.voiceState.currentVideo;
    }

    // ---- VC Actions ----
    async join() {
        if (this.voiceState.hasParticipant(this.client.user.id)) {
            throw new VoiceError('Already in voice channel');
        }
        this.voiceState.addParticipant(this.client.user.id);
        if (!this.voiceState.currentDJ) {
            this.dj.assign(this.client.user.id);
        }
        await this._save();
    }

    async leave() {
        this.voiceState.removeParticipant(this.client.user.id);
        if (this.voiceState.currentDJ === this.client.user.id) {
            this.dj.assignNext();
        }
        if (this.voiceState.participants.length === 0) {
            this.voiceState.stopPlayback();
        }
        await this._save();
    }

    async play(video) {
        if (this.currentDJ?.id !== this.client.user.id) {
            throw new VoiceError('Only the DJ can play videos');
        }
        this.queue.add(video);
        if (!this.isPlaying) {
            this.queue.playNext();
        }
        await this._save();
    }

    async skip() {
        if (this.currentDJ?.id !== this.client.user.id) {
            throw new VoiceError('Only the DJ can skip');
        }
        this.queue.playNext();
        await this._save();
    }

    async pause() {
        if (this.currentDJ?.id !== this.client.user.id) {
            throw new VoiceError('Only the DJ can pause');
        }
        this.voiceState.pause();
        await this._save();
    }

    async resume() {
        if (this.currentDJ?.id !== this.client.user.id) {
            throw new VoiceError('Only the DJ can resume');
        }
        this.voiceState.resume();
        await this._save();
    }

    async seek(seconds) {
        if (this.currentDJ?.id !== this.client.user.id) {
            throw new VoiceError('Only the DJ can seek');
        }
        this.voiceState.seek(seconds);
        await this._save();
    }

    async setDJ(username) {
        if (!this.voiceState.hasParticipant(username)) {
            throw new VoiceError('User is not in the voice channel');
        }
        this.dj.assign(username);
        await this._save();
    }

    async _save() {
        const guilds = this.client._getGuilds();
        const guild = guilds.find(g => g.id === this.guild.id);
        if (guild) {
            for (const cat of (guild.categories || [])) {
                const ch = (cat.channels || []).find(c => c.id === this.id);
                if (ch) {
                    ch.vcState = this.voiceState.toJSON();
                    this.client._saveGuilds(guilds);
                    return;
                }
            }
        }
    }
}

module.exports = VoiceChannel;
