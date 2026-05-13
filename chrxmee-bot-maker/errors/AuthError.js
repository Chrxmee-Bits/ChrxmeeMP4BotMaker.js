const ChrxmeeError = require('./ChrxmeeError');

class AuthError extends ChrxmeeError {
    constructor(message) {
        super(message);
        this.name = 'AuthError';
    }
}

module.exports = AuthError;
