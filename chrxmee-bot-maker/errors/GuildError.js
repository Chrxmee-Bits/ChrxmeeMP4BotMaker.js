const ChrxmeeError = require('./ChrxmeeError');

class GuildError extends ChrxmeeError {
    constructor(message) {
        super(message);
        this.name = 'GuildError';
    }
}

module.exports = GuildError;
