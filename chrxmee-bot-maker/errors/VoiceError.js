const ChrxmeeError = require('./ChrxmeeError');

class VoiceError extends ChrxmeeError {
    constructor(message) {
        super(message);
        this.name = 'VoiceError';
    }
}

module.exports = VoiceError;
