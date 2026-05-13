const ChrxmeeError = require('./ChrxmeeError');

class RateLimitError extends ChrxmeeError {
    constructor(type, retryAfter = 60000) {
        super(`Rate limited on ${type}. Retry after ${retryAfter}ms.`);
        this.name = 'RateLimitError';
        this.type = type;
        this.retryAfter = retryAfter;
    }
}

module.exports = RateLimitError;
