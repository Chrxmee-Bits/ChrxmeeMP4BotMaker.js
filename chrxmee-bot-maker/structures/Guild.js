const Base = require('./Base');
const ChannelManager = require('../managers/ChannelManager');
const GuildMemberManager = require('../managers/GuildMemberManager');
const RoleManager = require('../managers/RoleManager');
const InviteManager = require('../managers/InviteManager');
const EconomyManager = require('../managers/EconomyManager');
const WatchPartyManager = require('../managers/WatchPartyManager');
const TVScheduleManager = require('../managers/TVScheduleManager');
const AchievementManager = require('../managers/AchievementManager');
const EmojiManager = require('../managers/EmojiManager');
const StickerManager = require('../managers/StickerManager');
const EventManager = require('../managers/EventManager');
const Constants = require('../util/Constants');

class Guild extends Base {
    constructor(client, data) {
        super(client, data.id);
        this._raw = data;

        this.name = data.name || '';
        this.ownerId = data.owner || '';
        this.description = data.description || '';
        this.accent = data.accent || '#e50914';
        this.theme = data.theme || 'dark';
        this.icon = data.icon || '';
        this.banner = data.banner || '';
        this.category = data.category || '';
        this.type = data.type || 'public';
        this.createdAt = data.createdAt || new Date().toISOString();
        this.streak = data.streak || 0;
        this.lastActiveDate = data.lastActiveDate || '';
        this.bannedUsers = data.bannedUsers || [];
        this.mutedUsers = data.mutedUsers || [];
        this.mods = data.mods || [];
        this.feed = data.feed || [];
        this.activeTV = data.activeTV || null;

        this.channels = new ChannelManager(this.client, this, data.categories || []);
        this.members = new GuildMemberManager(this.client, this, data.members || []);
        this.roles = new RoleManager(this.client, this, data.roles || []);
        this.invites = new InviteManager(this.client, this, data.invites || []);
        this.economy = new EconomyManager(this.client, this);
        this.watchParties = new WatchPartyManager(this.client, this, data.watchParty);
        this.tvSchedule = new TVScheduleManager(this.client, this, data.tvSchedule || []);
        this.achievements = new AchievementManager(this.client, this, data.achievements || []);
        this.emojis = new EmojiManager(this.client, this);
        this.stickers = new StickerManager(this.client, this);
        this.events = new EventManager(this.client, this, data.events || []);
    }

    get owner() { return this.members.get(this.ownerId); }
    get memberCount() { return this.members.size; }

    get totalMessages() {
        let total = 0;
        for (const [, ch] of this.channels) {
            if (ch.messages) total += ch.messages.size;
        }
        return total;
    }

    get level() {
        return Math.floor(this.totalMessages / Constants.MSG_PER_LEVEL) + 1;
    }

    get xp() {
        return this.totalMessages % Constants.MSG_PER_LEVEL;
    }

    get xpPercent() {
        return (this.xp / Constants.MSG_PER_LEVEL) * 100;
    }

    get boostLevel() {
        const lvl = this.level;
        if (lvl >= 30) return 'boost3';
        if (lvl >= 20) return 'boost2';
        if (lvl >= 10) return 'boost1';
        return null;
    }

    get boostPerks() {
        return this.boostLevel ? Constants.BOOST_PERKS[this.boostLevel] : null;
    }

    get me() {
        return this.members.get(this.client.user?.id);
    }

    get isOwner() {
        return this.ownerId === this.client.user?.id;
    }

    async fetch() {
        const guilds = this.client.storage.getGuilds();
        const data = guilds.find(g => g.id === this.id);
        if (data) {
            this._raw = data;
            this._patch(data);
        }
        return this;
    }

    async leave() {
        return this.client.leaveGuild(this.id);
    }

    async createInvite(options = {}) {
        const code = 'inv_' + Date.now().toString(36);
        const invite = {
            code,
            active: true,
            createdBy: this.client.user.id,
            createdAt: new Date().toISOString(),
            uses: 0,
            maxUses: options.maxUses || 0,
            expires: options.expires || null
        };
        const guilds = this.client.storage.getGuilds();
        const guild = guilds.find(g => g.id === this.id);
        if (guild) {
            guild.invites = guild.invites || [];
            guild.invites.push(invite);
            this.client.storage.saveGuilds(guilds);
            return this.invites.add(invite);
        }
        return null;
    }

    async setName(name) { this.name = name; return this._save(); }
    async setDescription(desc) { this.description = desc; return this._save(); }
    async setAccent(color) { this.accent = color; return this._save(); }
    async setTheme(theme) { this.theme = theme; return this._save(); }
    async setIcon(url) { this.icon = url; return this._save(); }
    async setBanner(url) { this.banner = url; return this._save(); }

    async ban(userId) {
        if (!this.bannedUsers.includes(userId)) this.bannedUsers.push(userId);
        this.members.delete(userId);
        return this._save();
    }

    async unban(userId) {
        this.bannedUsers = this.bannedUsers.filter(u => u !== userId);
        return this._save();
    }

    async mute(userId) {
        if (!this.mutedUsers.includes(userId)) this.mutedUsers.push(userId);
        return this._save();
    }

    async unmute(userId) {
        this.mutedUsers = this.mutedUsers.filter(u => u !== userId);
        return this._save();
    }

    _patch(data) {
        if (data.name !== undefined) this.name = data.name;
        if (data.owner !== undefined) this.ownerId = data.owner;
        if (data.description !== undefined) this.description = data.description;
        if (data.accent !== undefined) this.accent = data.accent;
        if (data.theme !== undefined) this.theme = data.theme;
        if (data.icon !== undefined) this.icon = data.icon;
        if (data.banner !== undefined) this.banner = data.banner;
        if (data.streak !== undefined) this.streak = data.streak;
        if (data.lastActiveDate !== undefined) this.lastActiveDate = data.lastActiveDate;
        if (data.bannedUsers !== undefined) this.bannedUsers = data.bannedUsers;
        if (data.mutedUsers !== undefined) this.mutedUsers = data.mutedUsers;
        if (data.members) this.members = new GuildMemberManager(this.client, this, data.members);
        if (data.categories) this.channels = new ChannelManager(this.client, this, data.categories);
        if (data.roles) this.roles = new RoleManager(this.client, this, data.roles);
        if (data.invites) this.invites = new InviteManager(this.client, this, data.invites);
        if (data.watchParty !== undefined) this.watchParties = new WatchPartyManager(this.client, this, data.watchParty);
        if (data.tvSchedule) this.tvSchedule = new TVScheduleManager(this.client, this, data.tvSchedule);
        if (data.achievements) this.achievements = new AchievementManager(this.client, this, data.achievements);
        if (data.events) this.events = new EventManager(this.client, this, data.events);
        return this;
    }

    async _save() {
        const guilds = this.client.storage.getGuilds();
        const idx = guilds.findIndex(g => g.id === this.id);
        if (idx !== -1) {
            guilds[idx] = this.toStorageJSON();
            this.client.storage.saveGuilds(guilds);
            this._raw = guilds[idx];
        }
        return this;
    }

    toStorageJSON() {
        return {
            id: this.id, name: this.name, owner: this.ownerId,
            description: this.description, accent: this.accent, theme: this.theme,
            icon: this.icon, banner: this.banner, category: this.category,
            type: this.type, createdAt: this.createdAt, streak: this.streak,
            lastActiveDate: this.lastActiveDate, bannedUsers: [...this.bannedUsers],
            mutedUsers: [...this.mutedUsers], mods: [...this.mods],
            feed: [...this.feed], activeTV: this.activeTV,
            members: this.members.toArray(),
            categories: this.channels.toArray(),
            roles: this.roles.toArray(),
            invites: this.invites.toArray(),
            watchParty: this.watchParties.toJSON(),
            tvSchedule: this.tvSchedule.toArray(),
            achievements: this.achievements.toArray(),
            events: this.events.toArray()
        };
    }
}

module.exports = Guild;
