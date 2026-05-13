class BaseManager extends Map {
    constructor(client) {
        super();
        Object.defineProperty(this, 'client', { value: client });
    }
    add(data, cache = true, { id } = {}) {
        const key = id ?? data.id;
        if (!key) throw new Error('No ID provided for cache entry');
        const existing = this.get(key);
        if (existing) {
            existing._patch(data);
            return existing;
        }
        const entry = this._createInstance(data);
        if (cache) this.set(entry.id, entry);
        return entry;
    }
    _createInstance(data) {
        throw new Error('_createInstance must be implemented by subclass');
    }
    remove(id) {
        this.delete(id);
    }
    get cache() {
        return this;
    }
    async fetch(id) {
        throw new Error('fetch not implemented');
    }
}
module.exports = BaseManager;
