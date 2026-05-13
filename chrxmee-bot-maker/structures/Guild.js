const Base = require('./Base');
const GuildMemberManager = require('../managers/GuildMemberManager');
const ChannelManager = require('../managers/ChannelManager');
const RoleManager = require('../managers/RoleManager');
const InviteManager = require('../managers/InviteManager');
const EconomyManager = require('../managers/EconomyManager');
const WatchPartyManager = require('../managers/WatchPartyManager');
const TVScheduleManager = require('../managers/TVScheduleManager');
const AchievementManager = require('../managers/AchievementManager');
const EmojiManager = require('../managers/EmojiManager');
const { MSG_PER_LEVEL, BOOST_PERKS } = require('../util/Constants');

class Guild extends Base {
    constructor(client, data) {
        super(client, data.id);
        
        // Basic properties
        this.name = data.name;
        this.ownerId = data.owner;
        this.description = data.description || '';
        this.accent = data.accent || '#e50914';
        this.theme = data.theme || 'dark';
        this.icon = data.icon || '';
        this.banner = data.banner || '';
        this.category = data.category || '';
        this.createdAt = data.createdAt;
        this.streak = data.streak || 0;
        this.lastActiveDate = data.lastActiveDate;
        this.bannedUsers = data.bannedUsers || [];
        this.mutedUsers = data.mutedUsers || [];
        this.mods = data.mods || [];
        this.feed = data.feed || [];
        this.events = data.events || [];

        // Sub-managers (populated from data)
        this.members = new GuildMemberManager(this.client, this, data.members || []);
        this.channels = new ChannelManager(this.client, this, data.categories || []);
        this.roles = new RoleManager(this.client, this, data.roles || []);
        this.invites = new InviteManager(this.client, this, data.invites || []);
        this.economy = new EconomyManager(this.client, this);
        this.watchParties = new WatchPartyManager(this.client, this, data.watchParty);
        this.tvSchedule = new TVScheduleManager(this.client, this, data.tvSchedule || []);
        this.achievements = new AchievementManager(this.client, this, data.achievements || []);
        this.emojis = new EmojiManager(this.client, this);
    }

    // ---- Computed Properties ----
    get owner() {
        return this.members.get(this.ownerId);
    }

    get memberCount() {
        return this.members.size;
    }

    get totalMessages() {
        let total = 0;
        for (const [, channel] of this.channels) {
            if (channel.messages) total += channel.messages.size;
        }
        return total;
    }

    get level() {
        return Math.floor(this.totalMessages / MSG_PER_LEVEL) + 1;
    }

    get xp() {
        return this.totalMessages % MSG_PER_LEVEL;
    }

    get boostLevel() {
        const lvl = this.level;
        if (lvl >= 30) return 'boost3';
        if (lvl >= 20) return 'boost2';
        if (lvl >= 10) return 'boost1';
        return null;
    }

    get me() {
        return this.members.get(this.client.user?.id);
    }

    // ---- Methods ----
    async fetch() {
        const guilds = this.client._getGuilds();
        const data = guilds.find(g => g.id === this.id);
        if (data) this._patch(data);
        return this;
    }

    async leave() {
        const guilds = this.client._getGuilds();
        const guild = guilds.find(g => g.id === this.id);
        if (guild) {
            guild.members = (guild.members || []).filter(
                m => m.username !== this.client.user.id
            );
            this.client._saveGuilds(guilds);
            this.client.guilds.delete(this.id);
            this.client.emit('guildLeave', this);
        }
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
        const guilds = this.client._getGuilds();
        const guild = guilds.find(g => g.id === this.id);
        if (guild) {
            guild.invites = guild.invites || [];
            guild.invites.push(invite);
            this.client._saveGuilds(guilds);
            return this.invites.add(invite);
        }
        return null;
    }

    async setTheme(theme) {
        this.theme = theme;
        await this._save();
    }

    async setAccent(color) {
        this.accent = color;
        await this._save();
    }

    async setName(name) {
        this.name = name;
        await this._save();
    }

    async _patch(data) {
        if (data.name !== undefined) this.name = data.name;
        if (data.owner !== undefined) this.ownerId = data.owner;
        if (data.description !== undefined) this.description = data.description;
        if (data.accent !== undefined) this.accent = data.accent;
        if (data.theme !== undefined) this.theme = data.theme;
        if (data.icon !== undefined) this.icon = data.icon;
        if (data.banner !== undefined) this.banner = data.banner;
        if (data.streak !== undefined) this.streak = data.streak;
        if (data.lastActiveDate !== undefined) this.lastActiveDate = data.lastActiveDate;
        if (data.bannedUsers) this.bannedUsers = data.bannedUsers;
        if (data.mutedUsers) this.mutedUsers = data.mutedUsers;
        
        if (data.members) {
            this.members = new GuildMemberManager(this.client, this, data.members);
        }
        if (data.categories) {
            this.channels = new ChannelManager(this.client, this, data.categories);
        }
        if (data.roles) {
            this.roles = new RoleManager(this.client, this, data.roles);
        }
        if (data.invites) {
            this.invites = new InviteManager(this.client, this, data.invites);
        }
        if (data.watchParty !== undefined) {
            this.watchParties = new WatchPartyManager(this.client, this, data.watchParty);
        }
        if (data.tvSchedule) {
            this.tvSchedule = new TVScheduleManager(this.client, this, data.tvSchedule);
        }
        if (data.achievements) {
            this.achievements = new AchievementManager(this.client, this, data.achievements);
        }
        return this;
    }

    async _save() {
        const guilds = this.client._getGuilds();
        const idx = guilds.findIndex(g => g.id === this.id);
        if (idx !== -1) {
            // Serialize sub-managers back to plain objects
            guilds[idx] = this.toStorageJSON();
            this.client._saveGuilds(guilds);
        }
    }

    toStorageJSON() {
        return {
            id: this.id,
            name: this.name,
            owner: this.ownerId,
            description: this.description,
            accent: this.accent,
            theme: this.theme,
            icon: this.icon,
            banner: this.banner,
            category: this.category,
            createdAt: this.createdAt,
            streak: this.streak,
            lastActiveDate: this.lastActiveDate,
            bannedUsers: this.bannedUsers,
            mutedUsers: this.mutedUsers,
            mods: this.mods,
            feed: this.feed,
            events: this.events,
            members: this.members.toArray(),
            categories: this.channels.toArray(),
            roles: this.roles.toArray(),
            invites: this.invites.toArray(),
            watchParty: this.watchParties?.toJSON(),
            tvSchedule: this.tvSchedule.toArray(),
            achievements: this.achievements.toArray(),
        };
    }
}

module.exports = Guild;
