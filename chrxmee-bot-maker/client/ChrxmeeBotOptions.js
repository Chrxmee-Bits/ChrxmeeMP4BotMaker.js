class ChrxmeeBotOptions {
    constructor(config = {}) {
        this.token = config.token || '';
        this.prefix = config.prefix || '!';
        this.autoPoll = config.autoPoll !== false;
        this.pollInterval = config.pollInterval || 2000;
        this.rateLimitMessages = config.rateLimitMessages || 30;
        this.rateLimitDMs = config.rateLimitDMs || 10;
        this.rateLimitGuildJoins = config.rateLimitGuildJoins || 5;
        this.disableCommands = config.disableCommands || false;
        this.disableSlashCommands = config.disableSlashCommands || false;
        this.allowedGuilds = config.allowedGuilds || [];
    }
}

module.exports = ChrxmeeBotOptions;
