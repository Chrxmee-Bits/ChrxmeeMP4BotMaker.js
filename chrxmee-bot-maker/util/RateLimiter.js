class RateLimiter {
    constructor(options = {}) {
        this.limits = {
            messages: options.rateLimitMessages || 30,
            dms: options.rateLimitDMs || 10,
            guildJoins: options.rateLimitGuildJoins || 5
        };
        this.current = { ...this.limits };
        this._startReset();
    }

    check(type) {
        if (!this.current[type] && this.current[type] !== 0) return true;
        if (this.current[type] <= 0) return false;
        this.current[type]--;
        return true;
    }

    get remaining() {
        return { ...this.current };
    }

    isLimited(type) {
        return this.current[type] <= 0;
    }

    reset(type) {
        if (type) {
            this.current[type] = this.limits[type];
        } else {
            this.current = { ...this.limits };
        }
    }

    _startReset() {
        setInterval(() => {
            this.current = { ...this.limits };
        }, 60000);
    }
}

module.exports = RateLimiter;
