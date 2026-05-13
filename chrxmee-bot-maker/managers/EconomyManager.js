const BaseManager = require('./BaseManager');

class EconomyManager extends BaseManager {
    constructor(client, guild) {
        super(client);
        this.guild = guild;
    }

    getCoins(username) {
        const economy = this.client.storage.getEconomy();
        const user = economy.users ? economy.users[username] : null;
        return user ? user.coins || 0 : 0;
    }

    getBank() {
        const economy = this.client.storage.getEconomy();
        return (economy.guildBanks && economy.guildBanks[this.guild.id]) || 0;
    }

    async addCoins(username, amount) {
        const economy = this.client.storage.getEconomy();
        economy.users = economy.users || {};
        economy.users[username] = economy.users[username] || { coins: 0, history: [] };
        economy.users[username].coins = (economy.users[username].coins || 0) + amount;
        economy.users[username].history.push({
            type: 'add',
            amount,
            timestamp: Date.now()
        });
        this.client.storage.saveEconomy(economy);
        return economy.users[username].coins;
    }

    async spendCoins(username, amount, item = '') {
        const economy = this.client.storage.getEconomy();
        economy.users = economy.users || {};
        economy.users[username] = economy.users[username] || { coins: 0, history: [] };
        if ((economy.users[username].coins || 0) < amount) return false;
        economy.users[username].coins -= amount;
        economy.users[username].history.push({
            type: 'spend',
            amount,
            item,
            timestamp: Date.now()
        });
        this.client.storage.saveEconomy(economy);
        return true;
    }

    async addToBank(amount) {
        const economy = this.client.storage.getEconomy();
        economy.guildBanks = economy.guildBanks || {};
        economy.guildBanks[this.guild.id] = (economy.guildBanks[this.guild.id] || 0) + amount;
        this.client.storage.saveEconomy(economy);
        return economy.guildBanks[this.guild.id];
    }

    async spendFromBank(amount) {
        const economy = this.client.storage.getEconomy();
        economy.guildBanks = economy.guildBanks || {};
        if ((economy.guildBanks[this.guild.id] || 0) < amount) return false;
        economy.guildBanks[this.guild.id] -= amount;
        this.client.storage.saveEconomy(economy);
        return true;
    }

    getLeaderboard() {
        const economy = this.client.storage.getEconomy();
        const users = economy.users || {};
        return Object.entries(users)
            .sort((a, b) => (b[1].coins || 0) - (a[1].coins || 0))
            .slice(0, 10);
    }

    async rewardMessage(username) {
        return this.addCoins(username, 1);
    }

    async rewardDaily(username) {
        return this.addCoins(username, 25);
    }
}

module.exports = EconomyManager;
