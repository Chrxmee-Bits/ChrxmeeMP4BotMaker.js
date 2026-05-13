const Base = require('./Base');

class Plugin extends Base {
    constructor(client, data) {
        super(client, data.id);
        this.name = data.name;
        this.icon = data.icon || '🧩';
        this.description = data.desc || '';
        this.author = data.author;
        this.rating = data.rating || 5.0;
        this.preview = data.preview || '';
        this.status = data.status || 'approved';
        this.installed = false;
    }

    async install() {
        const installed = this.client._getInstalledPlugins();
        if (!installed.includes(this.id)) {
            installed.push(this.id);
            this.client._saveInstalledPlugins(installed);
            this.installed = true;
            this.client.emit('pluginInstall', this);
        }
    }

    async uninstall() {
        const installed = this.client._getInstalledPlugins();
        const filtered = installed.filter(id => id !== this.id);
        this.client._saveInstalledPlugins(filtered);
        this.installed = false;
        this.client.emit('pluginUninstall', this);
    }
}

module.exports = Plugin;
