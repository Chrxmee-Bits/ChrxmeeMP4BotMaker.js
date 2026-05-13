const Constants = require('./Constants');

class Permissions {
    static ALL = Constants.ALL_PERMISSIONS;

    static resolve(permissions) {
        if (!permissions) return [];
        if (Array.isArray(permissions)) return permissions;
        if (typeof permissions === 'string') return permissions.split(',').map(p => p.trim());
        return [];
    }

    static has(permissions, permission) {
        const perms = Permissions.resolve(permissions);
        if (perms.includes('admin')) return true;
        return perms.includes(permission);
    }

    static hasAny(permissions, requiredPerms) {
        const perms = Permissions.resolve(permissions);
        if (perms.includes('admin')) return true;
        return requiredPerms.some(p => perms.includes(p));
    }

    static hasAll(permissions, requiredPerms) {
        const perms = Permissions.resolve(permissions);
        if (perms.includes('admin')) return true;
        return requiredPerms.every(p => perms.includes(p));
    }

    static missing(permissions, requiredPerms) {
        const perms = Permissions.resolve(permissions);
        if (perms.includes('admin')) return [];
        return requiredPerms.filter(p => !perms.includes(p));
    }

    static getDefaults() {
        return {
            owner: [...Constants.ALL_PERMISSIONS],
            admin: Constants.ALL_PERMISSIONS.filter(p => p !== 'admin'),
            mod: ['manage_messages', 'mention_everyone', 'create_invite', 'voice_connect', 'send_messages', 'attach_media', 'read_messages', 'timeout_members', 'manage_events'],
            dj: ['voice_connect', 'dj', 'start_watch_party', 'manage_tv_schedule', 'send_messages', 'read_messages'],
            member: ['create_invite', 'voice_connect', 'send_messages', 'attach_media', 'read_messages', 'use_external_emojis']
        };
    }
}

module.exports = Permissions;
