const BaseManager = require('./BaseManager');
const Plugin = require('../structures/Plugin');

class PluginManager extends BaseManager {
    constructor(client) {
        super(client);
        this.installed = new Set();
    }

    _createInstance(data) {
        return new Plugin(this.client, data);
    }

    async fetchAll() {
        const marketplace = this.client._getPluginMarketplace();
        const approved = marketplace.filter(p => p.status !== 'rejected');
        const defaultPlugins = this.client._getDefaultPlugins();
        const all = [...defaultPlugins, ...approved];
        all.forEach(p => this.add(p));
        return this;
    }

    async fetchInstalled() {
        const installedIds = this.client._getInstalledPlugins();
        const all = await this.fetchAll();
        for (const id of installedIds) {
            const plugin = this.get(id);
            if (plugin) plugin.installed = true;
            this.installed.add(id);
        }
        return [...this.installed].map(id => this.get(id)).filter(Boolean);
    }

    async install(id) {
        const plugin = this.get(id);
        if (!plugin) throw new Error(`Plugin ${id} not found`);
        await plugin.install();
        this.installed.add(id);
        return plugin;
    }

    async uninstall(id) {
        const plugin = this.get(id);
        if (!plugin) throw new Error(`Plugin ${id} not found`);
        await plugin.uninstall();
        this.installed.delete(id);
        return plugin;
    }
}

module.exports = PluginManager;
