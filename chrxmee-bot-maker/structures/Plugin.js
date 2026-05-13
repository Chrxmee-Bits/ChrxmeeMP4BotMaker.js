const Base = require('./Base');

class Plugin extends Base {
    constructor(client, data) {
        super(client, data.id);
        this.name = data.name || '';
        this.icon = data.icon || '🧩';
        this.description = data.desc || data.description || '';
        this.author = data.author || '';
        this.rating = data.rating || 5.0;
        this.preview = data.preview || '';
        this.status = data.status || 'approved';
        this.installed = data.installed || false;
    }

    get authorUser() {
        return this.client.users.get(this.author);
    }

    async install() {
        const installed = this.client.storage.getInstalledPlugins();
        if (!installed.includes(this.id)) {
            installed.push(this.id);
            this.client.storage.saveInstalledPlugins(installed);
            this.installed = true;
            this.client.emit('pluginInstall', this);
        }
        return this;
    }

    async uninstall() {
        const installed = this.client.storage.getInstalledPlugins();
        const filtered = installed.filter(id => id !== this.id);
        this.client.storage.saveInstalledPlugins(filtered);
        this.installed = false;
        this.client.emit('pluginUninstall', this);
        return this;
    }

    get isInstalled() {
        const installed = this.client.storage.getInstalledPlugins();
        return installed.includes(this.id);
    }
}

module.exports = Plugin;
