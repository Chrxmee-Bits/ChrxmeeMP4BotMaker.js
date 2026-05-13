const BaseManager = require('./BaseManager');
const Plugin = require('../structures/Plugin');

class PluginManager extends BaseManager {
    constructor(client) {
        super(client);
    }

    _createInstance(data) {
        return new Plugin(this.client, data);
    }

    async fetchAll() {
        const marketplace = this.client.storage.getPluginMarketplace();
        const approved = marketplace.filter(p => p.status !== 'rejected');
        const installed = this.client.storage.getInstalledPlugins();

        // Load default plugins
        const defaults = this.client.Constants.DEFAULT_PLUGINS || [];
        defaults.forEach(p => {
            this.add({ ...p, status: 'approved', installed: installed.includes(p.id) });
        });

        // Load marketplace plugins
        approved.forEach(p => {
            this.add({ ...p, installed: installed.includes(p.id) });
        });

        return this;
    }

    async install(id) {
        const plugin = this.get(id);
        if (!plugin) throw new Error(`Plugin ${id} not found`);
        await plugin.install();
        return plugin;
    }

    async uninstall(id) {
        const plugin = this.get(id);
        if (!plugin) throw new Error(`Plugin ${id} not found`);
        await plugin.uninstall();
        return plugin;
    }

    get installed() {
        return [...this.values()].filter(p => p.isInstalled);
    }

    get available() {
        return [...this.values()].filter(p => !p.isInstalled);
    }
}

module.exports = PluginManager;
