const MSG_PER_LEVEL = 100;

const ALL_PERMISSIONS = [
    'admin', 'manage_guild', 'manage_channels', 'manage_members',
    'manage_roles', 'manage_messages', 'mention_everyone', 'create_invite',
    'voice_connect', 'dj', 'send_messages', 'attach_media', 'read_messages',
    'timeout_members', 'start_watch_party', 'manage_tv_schedule',
    'manage_events', 'use_external_emojis', 'speak_in_stage',
    'request_to_speak'
];

const DEFAULT_ROLES = {
    owner: {
        name: 'Owner', color: '#f1c40f', permissions: [...ALL_PERMISSIONS],
        locked: true, hoist: true
    },
    admin: {
        name: 'Admin', color: '#e50914',
        permissions: ALL_PERMISSIONS.filter(p => p !== 'admin'),
        locked: false, hoist: true
    },
    mod: {
        name: 'Moderator', color: '#3498db',
        permissions: ['manage_messages', 'mention_everyone', 'create_invite',
            'voice_connect', 'send_messages', 'attach_media', 'read_messages',
            'timeout_members', 'manage_events'],
        locked: false, hoist: true
    },
    dj: {
        name: 'DJ', color: '#2ecc71',
        permissions: ['voice_connect', 'dj', 'start_watch_party',
            'manage_tv_schedule', 'send_messages', 'read_messages'],
        locked: false, hoist: false
    },
    member: {
        name: 'Member', color: '#888',
        permissions: ['create_invite', 'voice_connect', 'send_messages',
            'attach_media', 'read_messages', 'use_external_emojis'],
        locked: true, hoist: false
    }
};

const BOOST_PERKS = {
    boost1: {
        level: 10, name: 'Boost 1', icon: '🚀',
        perks: ['Custom banner', 'Animated guild icon', 'GIF banner',
            'Custom invite link', '50 emoji slots']
    },
    boost2: {
        level: 20, name: 'Boost 2', icon: '🚀🚀',
        perks: ['Guild anthem', 'Role colors', 'Thread replies',
            'Slow mode', '100 emoji slots', 'Guild stage']
    },
    boost3: {
        level: 30, name: 'Boost 3', icon: '🚀🚀🚀',
        perks: ['Full VC DJ + Watch Party', 'Guild TV', 'Prestige badge',
            'Custom emojis', 'Guild stickers', 'Vanity URL', '200 emoji slots']
    }
};

const THEME_PRESETS = {
    dark: { bg: '#0a0a0a', surface: '#141414', accent: '#e50914', name: 'Dark' },
    ocean: { bg: '#0a1628', surface: '#0f1f3d', accent: '#00cec9', name: 'Ocean' },
    sunset: { bg: '#1a0a0a', surface: '#2d1414', accent: '#f39c12', name: 'Sunset' },
    forest: { bg: '#0a1a0a', surface: '#142814', accent: '#2ecc71', name: 'Forest' },
    cyberpunk: { bg: '#0a0a1a', surface: '#141428', accent: '#9b59b6', name: 'Cyberpunk' },
    midnight: { bg: '#000510', surface: '#0a0f1a', accent: '#6c5ce7', name: 'Midnight' },
    crimson: { bg: '#1a0505', surface: '#2d0a0a', accent: '#ff6b6b', name: 'Crimson' },
    arctic: { bg: '#050a1a', surface: '#0a1428', accent: '#a29bfe', name: 'Arctic' },
    neon: { bg: '#0a0a0a', surface: '#1a0030', accent: '#ff00ff', name: 'Neon' },
    matrix: { bg: '#000a00', surface: '#001a00', accent: '#00ff00', name: 'Matrix' },
    royal: { bg: '#0a0a1a', surface: '#1a1030', accent: '#ffd700', name: 'Royal' },
    candy: { bg: '#1a0a1a', surface: '#301430', accent: '#ff69b4', name: 'Candy' },
    steel: { bg: '#0a0a0f', surface: '#1a1a25', accent: '#8899aa', name: 'Steel' },
    lava: { bg: '#1a0a00', surface: '#301400', accent: '#ff4500', name: 'Lava' },
    frost: { bg: '#000a1a', surface: '#001430', accent: '#87ceeb', name: 'Frost' }
};

const GUILD_ACHIEVEMENTS = [
    { id: 'first_message', name: 'First Words', icon: '💬', desc: 'First message sent' },
    { id: 'hundred_msgs', name: 'Chatterbox', icon: '📢', desc: '100 messages' },
    { id: 'thousand_msgs', name: 'Community', icon: '🎉', desc: '1000 messages' },
    { id: 'ten_members', name: 'Squad', icon: '👥', desc: '10 members' },
    { id: 'fifty_members', name: 'Tribe', icon: '🏘️', desc: '50 members' },
    { id: 'hundred_members', name: 'Nation', icon: '🌍', desc: '100 members' },
    { id: 'first_watch_party', name: 'Host', icon: '🎬', desc: 'First watch party' },
    { id: 'first_tv_broadcast', name: 'Broadcaster', icon: '📺', desc: 'First TV broadcast' },
    { id: 'week_streak', name: 'Consistent', icon: '🔥', desc: '7 day streak' },
    { id: 'month_streak', name: 'Dedicated', icon: '💀', desc: '30 day streak' },
    { id: 'boost_1', name: 'Boosted', icon: '🚀', desc: 'Reached Boost 1' },
    { id: 'boost_3', name: 'Supercharged', icon: '🚀🚀🚀', desc: 'Reached Boost 3' }
];

const DEFAULT_PLUGINS = [
    { id: 'oled-theme', name: 'OLED Saver', icon: '🌙', desc: 'Pure black theme for AMOLED screens.', author: 'ChrxmaticcPresets', rating: 4.8 },
    { id: 'rainbow-accents', name: 'Rainbow Accents', icon: '🌈', desc: 'Accent cycles through rainbow colors.', author: 'ChrxmaticcPresets', rating: 4.6 },
    { id: 'custom-cursor', name: 'Custom Cursor', icon: '🖱️', desc: 'Changes cursor to a red pointer.', author: 'ChrxmaticcPresets', rating: 4.2 },
    { id: 'chat-sounds', name: 'Chat Sounds', icon: '🔊', desc: 'Subtle click when you get a message.', author: 'ChrxmaticcPresets', rating: 4.4 },
    { id: 'compact-mode', name: 'Compact Mode', icon: '📦', desc: '85% zoom for more content on screen.', author: 'ChrxmaticcPresets', rating: 4.1 },
    { id: 'neon-glow', name: 'Neon Glow', icon: '💡', desc: 'Glowing neon border around video cards.', author: 'ChrxmaticcPresets', rating: 4.7 },
    { id: 'particle-bg', name: 'Particle Background', icon: '✨', desc: 'Animated floating particles on the homepage.', author: 'ChrxmaticcPresets', rating: 4.9 },
    { id: 'snow-mode', name: 'Snowfall Effect', icon: '❄️', desc: 'Falling snowflakes across the entire site.', author: 'ChrxmaticcPresets', rating: 4.5 },
    { id: 'typewriter', name: 'Typewriter Mode', icon: '⌨️', desc: 'Text appears letter-by-letter with typing effect.', author: 'ChrxmaticcPresets', rating: 4.3 },
    { id: 'focus-mode', name: 'Focus Mode', icon: '🎯', desc: 'Dims everything except the video.', author: 'ChrxmaticcPresets', rating: 4.6 }
];

module.exports = {
    MSG_PER_LEVEL,
    ALL_PERMISSIONS,
    DEFAULT_ROLES,
    BOOST_PERKS,
    THEME_PRESETS,
    GUILD_ACHIEVEMENTS,
    DEFAULT_PLUGINS
};
