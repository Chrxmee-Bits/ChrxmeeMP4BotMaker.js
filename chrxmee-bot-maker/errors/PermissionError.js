const ChrxmeeError = require('./ChrxmeeError');

class PermissionError extends ChrxmeeError {
    constructor(message, permission) {
        super(message);
        this.name = 'PermissionError';
        this.permission = permission || null;
    }

    get missingPermission() {
        return this.permission;
    }
}

module.exports = PermissionError;
