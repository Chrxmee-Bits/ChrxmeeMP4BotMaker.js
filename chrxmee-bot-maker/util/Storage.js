class Storage {
    constructor() {
        this._cache = new Map();
    }

    _get(key) {
        try {
            return JSON.parse(localStorage.getItem(key) || 'null');
        } catch {
            return null;
        }
    }

    _set(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch {}
    }

    getRaw(key) {
        return localStorage.getItem(key) || '';
    }

    setRaw(key, value) {
        localStorage.setItem(key, value);
    }

    // ---- Bots ----
    getBots() {
        return this._get('chrxmeemp4_bots') || [];
    }

    saveBots(bots) {
        this._set('chrxmeemp4_bots', bots);
    }

    getBotLive(botId) {
        return this.getRaw('chrxmeemp4_bot_live_' + botId);
    }

    setBotLive(botId, live) {
        this.setRaw('chrxmeemp4_bot_live_' + botId, live ? 'true' : 'false');
    }

    getAddedBots() {
        try {
            return JSON.parse(this.getRaw('chrxmeemp4_added_bots') || '[]');
        } catch {
            return [];
        }
    }

    // ---- Guilds ----
    getGuilds() {
        return this._get('chrxmeemp4_guilds') || [];
    }

    saveGuilds(guilds) {
        this._set('chrxmeemp4_guilds', guilds);
    }

    // ---- Profiles ----
    getProfiles() {
        return this._get('chrxmeemp4_profiles') || {};
    }

    saveProfiles(profiles) {
        this._set('chrxmeemp4_profiles', profiles);
    }

    // ---- Videos / Library ----
    getPublicLibrary() {
        return this._get('chrxmeemp4_public_library') || [];
    }

    savePublicLibrary(videos) {
        this._set('chrxmeemp4_public_library', videos);
    }

    // ---- Messages ----
    getBotMessages() {
        return this._get('chrxmeemp4_bot_messages') || [];
    }

    saveBotMessages(messages) {
        this._set('chrxmeemp4_bot_messages', messages);
    }

    // ---- DMs ----
    getBotDMs() {
        try {
            return JSON.parse(this.getRaw('chrxmeemp4_bot_dms') || '[]');
        } catch {
            return [];
        }
    }

    saveBotDMs(dms) {
        this.setRaw('chrxmeemp4_bot_dms', JSON.stringify(dms));
    }

    // ---- Reactions ----
    getBotReactions() {
        try {
            return JSON.parse(this.getRaw('chrxmeemp4_bot_reactions') || '{}');
        } catch {
            return {};
        }
    }

    saveBotReactions(reactions) {
        this.setRaw('chrxmeemp4_bot_reactions', JSON.stringify(reactions));
    }

    // ---- Comments ----
    getComments() {
        return this._get('chrxmeemp4_comments') || [];
    }

    saveComments(comments) {
        this._set('chrxmeemp4_comments', comments);
    }

    // ---- Notifications ----
    getNotifications() {
        return this._get('chrxmeemp4_notifications') || [];
    }

    saveNotifications(notifications) {
        this._set('chrxmeemp4_notifications', notifications);
    }

    // ---- Plugins ----
    getPluginMarketplace() {
        return this._get('chrxmeemp4_plugin_marketplace') || [];
    }

    getInstalledPlugins() {
        try {
            return JSON.parse(this.getRaw('chrxmeemp4_installed_plugins') || '[]');
        } catch {
            return [];
        }
    }

    saveInstalledPlugins(plugins) {
        this.setRaw('chrxmeemp4_installed_plugins', JSON.stringify(plugins));
    }

    // ---- Economy ----
    getEconomy() {
        return this._get('chrxmeemp4_economy') || { users: {}, guildBanks: {} };
    }

    saveEconomy(economy) {
        this._set('chrxmeemp4_economy', economy);
    }

    // ---- Live Chat ----
    getLiveChat() {
        return this._get('chrxmeemp4_live_chat') || [];
    }

    saveLiveChat(messages) {
        this._set('chrxmeemp4_live_chat', messages);
    }

    // ---- Review Queue ----
    getReviewQueue() {
        return this._get('chrxmeemp4_review_queue') || [];
    }

    // ---- Submitted Plugins ----
    getSubmittedPlugins() {
        return this._get('chrxmeemp4_submitted_plugins') || [];
    }
}

module.exports = Storage;
