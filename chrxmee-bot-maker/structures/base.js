class Base {
    constructor(client, id) {
        Object.defineProperty(this, 'client', { value: client });
        Object.defineProperty(this, 'id', { value: id });
    }
    _clone() {
        return Object.assign(Object.create(this), this);
    }
    _patch(data) {
        Object.assign(this, data);
        return this;
    }
    toJSON() {
        return { ...this, client: undefined };
    }
}
module.exports = Base;
