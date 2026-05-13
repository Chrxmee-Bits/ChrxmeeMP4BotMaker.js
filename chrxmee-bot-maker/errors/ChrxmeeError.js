class ChrxmeeError extends Error {
    constructor(message) {
        super(message);
        this.name = 'ChrxmeeError';
    }
}

module.exports = ChrxmeeError;
