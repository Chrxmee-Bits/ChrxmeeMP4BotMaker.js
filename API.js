// src/API.js — Chrxmee-MP4 API Wrapper
class API {
    constructor(client) {
        this.client = client;
        this.baseURL = 'https://chrxmee-mp4-player.vercel.app';
    }

    async authenticate(token) {
        // Get bot data from localStorage equivalent
        const bots = JSON.parse(localStorage.getItem('chrxmeemp4_bots') || '[]');
        return bots.find(b => b.token === token && b.status === 'approved') || null;
    }

    async getPendingMessages(botId) {
        const msgs = JSON.parse(localStorage.getItem('chrxmeemp4_bot_messages') || '[]');
        const pending = msgs.filter(m => m.botId === botId && !m.processed);
        pending.forEach(m => { m.processed = true; });
        localStorage.setItem('chrxmeemp4_bot_messages', JSON.stringify(msgs));
        return pending;
    }

    async sendMessage(botId, guildId, channelId, text) {
        const msg = {
            id: 'msg_' + Date.now(),
            botId,
            guildId,
            channelId,
            text,
            timestamp: Date.now(),
            from: botId
        };
        // Store in guild channel
        const guilds = JSON.parse(localStorage.getItem('chrxmeemp4_guilds') || '[]');
        const guild = guilds.find(g => g.id === guildId);
        if (guild) {
            const cat = guild.categories?.[0];
            const ch = cat?.channels?.find(c => c.id === channelId);
            if (ch) {
                ch.messages = ch.messages || [];
                ch.messages.push(msg);
                localStorage.setItem('chrxmeemp4_guilds', JSON.stringify(guilds));
            }
        }
        return msg;
    }

    async sendDM(botId, username, text) {
        const convoId = [botId, username].sort().join('_');
        const msg = {
            id: 'dm_' + Date.now(),
            convoId,
            from: botId,
            to: username,
            text,
            timestamp: Date.now()
        };
        const allDMs = JSON.parse(localStorage.getItem('chrxmeemp4_bot_dms') || '[]');
        allDMs.push(msg);
        localStorage.setItem('chrxmeemp4_bot_dms', JSON.stringify(allDMs));
        return msg;
    }

    async searchVideo(query) {
        const videos = JSON.parse(localStorage.getItem('chrxmeemp4_public_library') || '[]');
        const results = videos.filter(v => 
            (v.title || '').toLowerCase().includes(query.toLowerCase()) ||
            (v.description || '').toLowerCase().includes(query.toLowerCase())
        );
        return results[0] || null;
    }

    async getProfile(username) {
        const profiles = JSON.parse(localStorage.getItem('chrxmeemp4_profiles') || '{}');
        return profiles[username] || null;
    }
}

module.exports = API;
