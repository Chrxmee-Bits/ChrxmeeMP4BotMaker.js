class PluginHandler {
    constructor(client) {
        this.client = client;
        this.lastInstalled = [];
    }

    check() {
        if (!this.client.connected) return;

        const installed = this.client.storage.getInstalledPlugins();

        // New installs
        const newInstalls = installed.filter(id => !this.lastInstalled.includes(id));
        for (const id of newInstalls) {
            const plugin = this.client.plugins.get(id);
            if (plugin) {
                this.client.emit('pluginInstall', plugin);
            }
        }

        // Uninstalls
        const uninstalled = this.lastInstalled.filter(id => !installed.includes(id));
        for (const id of uninstalled) {
            const plugin = this.client.plugins.get(id);
            if (plugin) {
                this.client.emit('pluginUninstall', plugin);
            }
        }

        this.lastInstalled = [...installed];
    }
}

module.exports = PluginHandler;
