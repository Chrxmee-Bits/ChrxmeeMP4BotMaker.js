// src/Utils.js — Utility Functions
class Utils {
    static formatDuration(seconds) {
        if (!seconds || isNaN(seconds)) return '0:00';
        const m = Math.floor(seconds / 60);
        const s = Math.floor(seconds % 60);
        return `${m}:${s.toString().padStart(2, '0')}`;
    }

    static formatNumber(num) {
        if (!num) return '0';
        if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
        if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
        return num.toString();
    }

    static timeAgo(date) {
        const diff = Date.now() - date.getTime();
        const m = Math.floor(diff / 60000);
        const h = Math.floor(diff / 3600000);
        const d = Math.floor(diff / 86400000);
        if (m < 1) return 'just now';
        if (m < 60) return `${m}m ago`;
        if (h < 24) return `${h}h ago`;
        return `${d}d ago`;
    }

    static escapeHtml(str) {
        if (!str) return '';
        const div = { textContent: str };
        return str.replace(/[<>"']/g, '');
    }

    static randomId() {
        return 'id_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 8);
    }
}

module.exports = Utils;
