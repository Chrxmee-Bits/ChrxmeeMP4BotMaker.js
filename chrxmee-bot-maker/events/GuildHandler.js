class GuildHandler {
    constructor(client) {
        this.client = client;
        this.lastGuildIds = new Set();
        this.lastMemberCounts = new Map();
        this.lastAchievements = new Map();
        this.initialized = false;
    }

    check() {
        if (!this.client.connected) return;

        const currentGuildIds = new Set();
        const guilds = this.client.storage.getGuilds();

        for (const g of guilds) {
            if (!g.members || !g.members.some(m => m.username === this.client.user.id)) continue;

            currentGuildIds.add(g.id);

            // Member count changes
            const memberCount = (g.members || []).length;
            const lastCount = this.lastMemberCounts.get(g.id);
            if (lastCount !== undefined && lastCount !== memberCount) {
                const guild = this.client.guilds.get(g.id);
                if (guild) {
                    this.client.emit('guildMemberCountChange', guild, memberCount, lastCount);
                }
            }
            this.lastMemberCounts.set(g.id, memberCount);

            // Achievement unlocks
            const achievements = g.achievements || [];
            const lastAch = this.lastAchievements.get(g.id) || [];
            const newAch = achievements.filter(a => !lastAch.includes(a));
            for (const achId of newAch) {
                const guild = this.client.guilds.get(g.id);
                const achievement = guild ? guild.achievements.get(achId) : null;
                if (guild && achievement) {
                    this.client.emit('guildAchievementUnlock', guild, achievement);
                }
            }
            this.lastAchievements.set(g.id, [...achievements]);

            // TV schedule active
            if (g.activeTV && (!this.lastActiveTV || this.lastActiveTV.get(g.id) !== g.activeTV.url)) {
                const guild = this.client.guilds.get(g.id);
                if (guild) {
                    this.client.emit('guildTVStart', guild, g.activeTV);
                }
            }
            if (!g.activeTV && this.lastActiveTV && this.lastActiveTV.has(g.id)) {
                const guild = this.client.guilds.get(g.id);
                if (guild) {
                    this.client.emit('guildTVEnd', guild);
                }
            }
        }

        // Guild joins
        if (this.initialized) {
            for (const id of currentGuildIds) {
                if (!this.lastGuildIds.has(id)) {
                    const guild = this.client.guilds.get(id);
                    if (guild) {
                        this.client.emit('guildJoin', guild);
                    }
                }
            }

            // Guild leaves
            for (const id of this.lastGuildIds) {
                if (!currentGuildIds.has(id)) {
                    const guild = this.client.guilds.get(id);
                    if (guild) {
                        this.client.emit('guildLeave', guild);
                        this.client.guilds.delete(id);
                    }
                }
            }
        }

        this.lastGuildIds = currentGuildIds;
        this.initialized = true;
    }
}

module.exports = GuildHandler;
