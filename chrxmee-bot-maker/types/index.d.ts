declare module 'chrxmee-mp4-bot-maker' {
    import { EventEmitter } from 'events';

    // ---- Options ----
    interface ChrxmeeBotOptions {
        token?: string;
        prefix?: string;
        autoPoll?: boolean;
        pollInterval?: number;
        rateLimitMessages?: number;
        rateLimitDMs?: number;
        rateLimitGuildJoins?: number;
        disableCommands?: boolean;
        disableSlashCommands?: boolean;
        allowedGuilds?: string[];
    }

    // ---- Base ----
    class Base {
        readonly client: ChrxmeeBot;
        readonly id: string;
        _patch(data: any): this;
        toJSON(): any;
    }

    // ---- Structures ----
    class Message extends Base {
        readonly guildId: string | null;
        readonly channelId: string | null;
        readonly authorId: string;
        content: string;
        readonly timestamp: number;
        readonly editedTimestamp: number | null;
        readonly gameMsg: boolean;
        readonly botMessage: boolean;
        readonly botName: string;
        readonly botAvatar: string;
        readonly attachments: any[];
        readonly reactions: any[];
        readonly guild: Guild | null;
        readonly channel: GuildChannel | null;
        readonly member: GuildMember | null;
        readonly author: User | null;
        readonly createdTimestamp: number;
        readonly createdAt: Date;
        readonly editable: boolean;
        readonly isPinned: boolean;
        reply(content: string): Promise<any>;
        edit(content: string): Promise<Message | null>;
        delete(): Promise<boolean>;
        react(emoji: string): Promise<any>;
        pin(): Promise<boolean>;
        unpin(): Promise<boolean>;
    }

    class User extends Base {
        username: string;
        displayName: string;
        avatar: string;
        avatarColor: string;
        bio: string;
        badges: string[];
        readonly createdAt: string | null;
        readonly lastOnline: number;
        readonly isOnline: boolean;
        readonly profile: Profile | null;
        readonly tag: string;
        fetch(): Promise<User>;
        dm(content: string): Promise<any>;
        send(content: string): Promise<any>;
    }

    class Profile extends Base {
        username: string;
        displayName: string;
        avatarImage: string;
        avatarColor: string;
        bio: string;
        badges: string[];
        readonly createdAt: string | null;
        subscribers: number;
        totalViews: number;
        totalUploads: number;
        readonly user: User | null;
        readonly isOnline: boolean;
        fetch(): Promise<Profile>;
        setBio(bio: string): Promise<void>;
        setDisplayName(name: string): Promise<void>;
    }

    class Guild extends Base {
        name: string;
        ownerId: string;
        description: string;
        accent: string;
        theme: string;
        icon: string;
        banner: string;
        category: string;
        type: string;
        readonly createdAt: string;
        streak: number;
        lastActiveDate: string;
        bannedUsers: string[];
        mutedUsers: string[];
        mods: string[];
        feed: any[];
        activeTV: any;
        readonly channels: ChannelManager;
        readonly members: GuildMemberManager;
        readonly roles: RoleManager;
        readonly invites: InviteManager;
        readonly economy: EconomyManager;
        readonly watchParties: WatchPartyManager;
        readonly tvSchedule: TVScheduleManager;
        readonly achievements: AchievementManager;
        readonly emojis: EmojiManager;
        readonly stickers: StickerManager;
        readonly events: EventManager;
        readonly owner: GuildMember | null;
        readonly memberCount: number;
        readonly totalMessages: number;
        readonly level: number;
        readonly xp: number;
        readonly xpPercent: number;
        readonly boostLevel: string | null;
        readonly boostPerks: any | null;
        readonly me: GuildMember | null;
        readonly isOwner: boolean;
        fetch(): Promise<Guild>;
        leave(): Promise<void>;
        createInvite(options?: InviteOptions): Promise<Invite | null>;
        setName(name: string): Promise<Guild>;
        setDescription(desc: string): Promise<Guild>;
        setAccent(color: string): Promise<Guild>;
        setTheme(theme: string): Promise<Guild>;
        setIcon(url: string): Promise<Guild>;
        setBanner(url: string): Promise<Guild>;
        ban(userId: string): Promise<Guild>;
        unban(userId: string): Promise<Guild>;
        mute(userId: string): Promise<Guild>;
        unmute(userId: string): Promise<Guild>;
    }

    class GuildChannel extends Base {
        readonly guild: Guild;
        name: string;
        type: string;
        topic: string;
        slowMode: number;
        categoryId: string | null;
        position: number;
        nsfw: boolean;
        readonly messages: MessageManager;
        pinnedMessages: string[];
        readonly isText: boolean;
        readonly isVoice: boolean;
        readonly isStage: boolean;
        readonly isRadio: boolean;
        readonly isTV: boolean;
        setName(name: string): Promise<GuildChannel>;
        setTopic(topic: string): Promise<GuildChannel>;
        setSlowMode(seconds: number): Promise<GuildChannel>;
        send(content: string): Promise<any>;
        bulkDelete(count?: number): Promise<number>;
    }

    class TextChannel extends GuildChannel {
        readonly lastMessage: Message | null;
        readonly lastMessageId: string | null;
        startTyping(): Promise<void>;
        stopTyping(): Promise<void>;
    }

    class VoiceChannel extends GuildChannel {
        readonly voiceState: any;
        readonly queue: VoiceQueue;
        readonly dj: DJManager;
        readonly participants: any[];
        readonly currentDJ: any;
        readonly isPlaying: boolean;
        readonly currentVideo: any;
        readonly participantCount: number;
        join(): Promise<VoiceChannel>;
        leave(): Promise<VoiceChannel>;
        play(video: VideoData): Promise<any>;
        skip(): Promise<any>;
        pause(): Promise<VoiceChannel>;
        resume(): Promise<VoiceChannel>;
        seek(seconds: number): Promise<VoiceChannel>;
        setDJ(username: string): Promise<VoiceChannel>;
    }

    class StageChannel extends VoiceChannel {
        speakers: string[];
        speakerRequests: string[];
        readonly isSpeaker: boolean;
        readonly audience: any[];
        readonly speakersList: any[];
        requestToSpeak(): Promise<StageChannel>;
        cancelRequest(): Promise<StageChannel>;
        promoteToSpeaker(username: string): Promise<StageChannel>;
        demoteSpeaker(username: string): Promise<StageChannel>;
    }

    class RadioChannel extends GuildChannel {
        station: string | null;
        currentTrack: any;
        listeners: string[];
        readonly listenerCount: number;
        setStation(url: string): Promise<RadioChannel>;
        join(): Promise<RadioChannel>;
        leave(): Promise<RadioChannel>;
    }

    class TVChannel extends GuildChannel {
        currentBroadcast: any;
        schedule: any[];
        readonly isLive: boolean;
        readonly currentShow: any;
        startBroadcast(video: VideoData): Promise<TVChannel>;
        stopBroadcast(): Promise<TVChannel>;
        addToSchedule(time: string, video: VideoData): Promise<TVChannel>;
        removeFromSchedule(index: number): Promise<TVChannel>;
    }

    class GuildMember extends Base {
        readonly guild: Guild;
        username: string;
        role: string;
        readonly joinedAt: string;
        nickname: string | null;
        readonly user: User | null;
        readonly displayName: string;
        readonly permissions: string[];
        readonly isOwner: boolean;
        readonly isAdmin: boolean;
        readonly isMod: boolean;
        readonly isMuted: boolean;
        readonly isBanned: boolean;
        hasPermission(perm: string): boolean;
        kick(): Promise<boolean>;
        ban(): Promise<boolean>;
        setRole(role: string): Promise<boolean>;
        setNickname(nick: string): Promise<void>;
        mute(): Promise<Guild>;
        unmute(): Promise<Guild>;
    }

    class Role extends Base {
        readonly guild: Guild;
        name: string;
        color: string;
        permissions: string[];
        readonly locked: boolean;
        hoist: boolean;
        position: number;
        readonly hexColor: string;
        readonly members: GuildMember[];
        readonly memberCount: number;
        readonly editable: boolean;
        hasPermission(perm: string): boolean;
        setPermissions(perms: string[]): Promise<Role>;
        setColor(color: string): Promise<Role>;
        setName(name: string): Promise<Role>;
        delete(): Promise<boolean>;
    }

    class Invite extends Base {
        readonly guild: Guild;
        code: string;
        active: boolean;
        readonly createdBy: string;
        readonly createdAt: string;
        uses: number;
        maxUses: number;
        expires: string | null;
        readonly url: string;
        readonly isExpired: boolean;
        readonly isMaxed: boolean;
        readonly isValid: boolean;
        delete(): Promise<boolean>;
    }

    class Video extends Base {
        title: string;
        description: string;
        url: string;
        thumbnail: string;
        duration: number;
        uploader: string;
        readonly uploadedAt: string;
        views: number;
        likes: number;
        tags: string[];
        category: string;
        isPublic: boolean;
        readonly uploaderUser: User | null;
        readonly comments: Comment[];
        readonly formattedDuration: string;
        readonly formattedViews: string;
        fetch(): Promise<Video>;
        delete(): Promise<boolean>;
    }

    class Comment extends Base {
        videoId: string;
        authorId: string;
        content: string;
        readonly timestamp: number;
        edited: boolean;
        likes: number;
        readonly author: User | null;
        readonly video: Video | null;
        reply(content: string): Promise<Comment>;
        edit(content: string): Promise<Comment>;
        delete(): Promise<boolean>;
        like(): Promise<Comment>;
    }

    class Notification extends Base {
        userId: string;
        type: string;
        title: string;
        body: string;
        icon: string;
        read: boolean;
        readonly timestamp: number;
        actionUrl: string;
        fromId: string;
        readonly user: User | null;
        readonly from: User | null;
        markRead(): Promise<Notification>;
        markUnread(): Promise<Notification>;
        delete(): Promise<boolean>;
    }

    class Plugin extends Base {
        name: string;
        icon: string;
        description: string;
        author: string;
        rating: number;
        preview: string;
        status: string;
        installed: boolean;
        readonly authorUser: User | null;
        readonly isInstalled: boolean;
        install(): Promise<Plugin>;
        uninstall(): Promise<Plugin>;
    }

    class Emoji extends Base {
        readonly guild: Guild;
        name: string;
        emoji: string;
        url: string;
        animated: boolean;
        readonly createdBy: string;
        readonly createdAt: string;
        readonly isCustom: boolean;
        delete(): Promise<boolean>;
    }

    class Sticker extends Base {
        readonly guild: Guild;
        name: string;
        url: string;
        packName: string;
        readonly createdAt: string;
        readonly pack: string;
        delete(): Promise<boolean>;
    }

    class WatchParty extends Base {
        readonly guild: Guild;
        url: string;
        readonly startedBy: string;
        readonly startedAt: number;
        isLive: boolean;
        viewers: string[];
        currentTime: number;
        isPlaying: boolean;
        readonly host: User | null;
        readonly viewerCount: number;
        join(): Promise<WatchParty>;
        leave(): Promise<WatchParty>;
        end(): Promise<WatchParty>;
    }

    class TVScheduleEntry extends Base {
        readonly guild: Guild;
        time: string;
        title: string;
        url: string;
        readonly addedBy: string;
        readonly addedAt: number;
        readonly adder: User | null;
        readonly isNow: boolean;
        remove(): Promise<boolean>;
    }

    class Achievement extends Base {
        readonly guild: Guild;
        name: string;
        icon: string;
        description: string;
        readonly unlockedAt: string | null;
        readonly isUnlocked: boolean;
        readonly unlockedDate: Date | null;
    }

    class BotApplication extends Base {
        name: string;
        description: string;
        avatar: string;
        prefix: string;
        token: string;
        readonly ownerId: string;
        readonly status: string;
        readonly createdAt: string;
        readonly guildIds: string[];
        totalMessages: number;
        accent: string;
        tags: string[];
        webhookUrl: string;
        presence: any;
        readonly owner: User | null;
        readonly guildCount: number;
        readonly isApproved: boolean;
        readonly isPending: boolean;
        readonly isBanned: boolean;
        regenerateToken(): Promise<string>;
        setWebhook(url: string): Promise<BotApplication>;
    }

    class GuildEvent extends Base {
        readonly guild: Guild;
        name: string;
        description: string;
        location: string;
        readonly startTime: string | null;
        readonly endTime: string | null;
        readonly createdBy: string;
        readonly createdAt: number;
        attendees: string[];
        readonly creator: User | null;
        readonly isActive: boolean;
        readonly isUpcoming: boolean;
        readonly isPast: boolean;
        readonly attendeeCount: number;
        join(): Promise<GuildEvent>;
        leave(): Promise<GuildEvent>;
        delete(): Promise<boolean>;
    }

    // ---- Managers ----
    class BaseManager<K, V> extends Map<K, V> {
        readonly client: ChrxmeeBot;
        add(data: any, cache?: boolean, options?: { id?: string }): V;
        remove(id: string): void;
        readonly cache: Map<K, V>;
        fetch(id: string): Promise<V | null>;
    }

    class GuildManager extends BaseManager<string, Guild> {
        fetch(id: string): Promise<Guild | null>;
        fetchAll(): Promise<GuildManager>;
        create(name: string, options?: GuildCreateOptions): Promise<Guild>;
        delete(id: string): Promise<void>;
    }

    class ChannelManager extends BaseManager<string, GuildChannel> {
        readonly guild: Guild;
        create(name: string, options?: ChannelCreateOptions): Promise<GuildChannel | null>;
        delete(id: string): Promise<boolean>;
    }

    class GuildMemberManager extends BaseManager<string, GuildMember> {
        readonly guild: Guild;
        readonly owner: GuildMember | null;
        readonly admins: GuildMember[];
        readonly mods: GuildMember[];
        fetch(username: string): Promise<GuildMember | null>;
        kick(username: string): Promise<boolean>;
        ban(username: string): Promise<boolean>;
        setRole(username: string, role: string): Promise<boolean>;
    }

    class RoleManager extends BaseManager<string, Role> {
        readonly guild: Guild;
        create(name: string, options?: RoleCreateOptions): Promise<Role | null>;
        delete(name: string): Promise<boolean>;
    }

    class InviteManager extends BaseManager<string, Invite> {
        readonly guild: Guild;
        create(options?: InviteOptions): Promise<Invite | null>;
        delete(code: string): Promise<boolean>;
    }

    class UserManager extends BaseManager<string, User> {
        readonly online: User[];
        fetch(username: string): Promise<User>;
        fetchAll(): Promise<UserManager>;
    }

    class VideoManager extends BaseManager<string, Video> {
        readonly trending: Video[];
        readonly recent: Video[];
        fetch(id: string): Promise<Video | null>;
        fetchAll(): Promise<VideoManager>;
        search(query: string): Promise<Video[]>;
        upload(metadata: VideoUploadData): Promise<Video>;
        delete(id: string): Promise<boolean>;
    }

    class MessageManager extends BaseManager<string, Message> {
        readonly channel: GuildChannel;
        readonly guild: Guild;
        readonly last: Message | null;
        readonly first: Message | null;
        fetch(id: string): Promise<Message | null>;
        fetchAll(limit?: number): Promise<MessageManager>;
        delete(id: string): Promise<boolean>;
    }

    class CommentManager extends BaseManager<string, Comment> {
        forVideo(videoId: string): Comment[];
        create(videoId: string, content: string): Promise<Comment>;
        fetch(id: string): Promise<Comment | null>;
        delete(id: string): Promise<boolean>;
    }

    class NotificationManager extends BaseManager<string, Notification> {
        readonly unread: Notification[];
        readonly read: Notification[];
        fetchAll(): Promise<NotificationManager>;
        send(userId: string, options?: NotificationOptions): Promise<Notification>;
        markAllRead(): Promise<void>;
        clearAll(): Promise<void>;
    }

    class PluginManager extends BaseManager<string, Plugin> {
        readonly installed: Plugin[];
        readonly available: Plugin[];
        fetchAll(): Promise<PluginManager>;
        install(id: string): Promise<Plugin>;
        uninstall(id: string): Promise<Plugin>;
    }

    class ProfileManager extends BaseManager<string, Profile> {
        readonly topUploaders: Profile[];
        fetch(username: string): Promise<Profile | null>;
        fetchAll(): Promise<ProfileManager>;
        update(username: string, updates: any): Promise<Profile | null>;
    }

    class EconomyManager extends BaseManager<string, any> {
        readonly guild: Guild;
        getCoins(username: string): number;
        getBank(): number;
        addCoins(username: string, amount: number): Promise<number>;
        spendCoins(username: string, amount: number, item?: string): Promise<boolean>;
        addToBank(amount: number): Promise<number>;
        spendFromBank(amount: number): Promise<boolean>;
        getLeaderboard(): [string, any][];
        rewardMessage(username: string): Promise<number>;
        rewardDaily(username: string): Promise<number>;
    }

    class WatchPartyManager extends BaseManager<string, WatchParty> {
        readonly guild: Guild;
        readonly current: WatchParty | null;
        readonly isActive: boolean;
        start(url: string, title?: string): Promise<WatchParty | null>;
        end(): Promise<boolean>;
    }

    class TVScheduleManager extends BaseManager<string, TVScheduleEntry> {
        readonly guild: Guild;
        readonly upcoming: TVScheduleEntry[];
        readonly now: TVScheduleEntry | null;
        add(time: string, title: string, url?: string): Promise<TVScheduleEntry | null>;
        remove(id: string): Promise<boolean>;
    }

    class AchievementManager extends BaseManager<string, Achievement> {
        readonly guild: Guild;
        readonly unlocked: Achievement[];
        readonly locked: Achievement[];
        readonly totalCount: number;
        readonly unlockedCount: number;
    }

    class EmojiManager extends BaseManager<string, Emoji> {
        readonly guild: Guild;
        create(name: string, url: string, options?: { animated?: boolean }): Promise<Emoji | null>;
        delete(id: string): Promise<boolean>;
    }

    class StickerManager extends BaseManager<string, Sticker> {
        readonly guild: Guild;
        readonly packs: Map<string, Sticker[]>;
        create(name: string, url: string, packName?: string): Promise<Sticker | null>;
        delete(id: string): Promise<boolean>;
    }

    class EventManager extends BaseManager<string, GuildEvent> {
        readonly guild: Guild;
        readonly active: GuildEvent[];
        readonly upcoming: GuildEvent[];
        readonly past: GuildEvent[];
        create(name: string, options?: EventCreateOptions): Promise<GuildEvent | null>;
        delete(id: string): Promise<boolean>;
    }

    // ---- Voice ----
    class VoiceQueue {
        readonly length: number;
        readonly isEmpty: boolean;
        readonly current: any;
        readonly upcoming: any[];
        add(video: VideoData): any;
        remove(index: number): any;
        playNext(): any;
        skip(): any;
        clear(): void;
        reorder(fromIndex: number, toIndex: number): boolean;
    }

    class DJManager {
        readonly current: any;
        readonly isCurrentUserDJ: boolean;
        assign(username: string): void;
        assignNext(): void;
        assignRandom(): void;
        rotate(): void;
    }

    // ---- Utils ----
    class Utils {
        static formatDuration(seconds: number): string;
        static formatNumber(n: number): string;
        static timeAgo(date: Date | string | number): string;
        static randomId(prefix?: string): string;
        static escapeHtml(str: string): string;
        static truncate(str: string, length?: number, suffix?: string): string;
        static shuffleArray<T>(arr: T[]): T[];
        static chunkArray<T>(arr: T[], size: number): T[][];
        static isValidUrl(str: string): boolean;
        static parseEmoji(emojiStr: string): any;
        static sleep(ms: number): Promise<void>;
    }

    class Permissions {
        static ALL: string[];
        static resolve(permissions: string[] | string): string[];
        static has(permissions: string[] | string, permission: string): boolean;
        static hasAny(permissions: string[] | string, requiredPerms: string[]): boolean;
        static hasAll(permissions: string[] | string, requiredPerms: string[]): boolean;
        static missing(permissions: string[] | string, requiredPerms: string[]): string[];
        static getDefaults(): any;
    }

    // ---- Errors ----
    class ChrxmeeError extends Error {
        name: 'ChrxmeeError';
    }

    class AuthError extends ChrxmeeError {
        name: 'AuthError';
    }

    class PermissionError extends ChrxmeeError {
        name: 'PermissionError';
        readonly permission: string | null;
        readonly missingPermission: string | null;
    }

    class RateLimitError extends ChrxmeeError {
        name: 'RateLimitError';
        readonly type: string;
        readonly retryAfter: number;
    }

    class VoiceError extends ChrxmeeError {
        name: 'VoiceError';
    }

    class GuildError extends ChrxmeeError {
        name: 'GuildError';
    }

    // ---- Interfaces ----
    interface InviteOptions {
        maxUses?: number;
        expires?: string;
    }

    interface GuildCreateOptions {
        type?: string;
        category?: string;
        description?: string;
        accent?: string;
        theme?: string;
        icon?: string;
        banner?: string;
    }

    interface ChannelCreateOptions {
        type?: string;
        topic?: string;
        slowMode?: number;
        nsfw?: boolean;
        categoryId?: string;
    }

    interface RoleCreateOptions {
        color?: string;
        permissions?: string[];
        locked?: boolean;
        hoist?: boolean;
        position?: number;
    }

    interface VideoData {
        src?: string;
        url?: string;
        title?: string;
        id?: string;
        thumbnail?: string;
        timestamp?: number;
        duration?: number;
    }

    interface VideoUploadData {
        title?: string;
        description?: string;
        url?: string;
        src?: string;
        thumbnail?: string;
        duration?: number;
        tags?: string[];
        category?: string;
        isPublic?: boolean;
    }

    interface NotificationOptions {
        type?: string;
        title?: string;
        body?: string;
        text?: string;
        icon?: string;
        actionUrl?: string;
        url?: string;
    }

    interface EventCreateOptions {
        description?: string;
        location?: string;
        startTime?: string;
        startsAt?: string;
        endTime?: string;
        endsAt?: string;
    }

    // ---- Main Client ----
    class ChrxmeeBot extends EventEmitter {
        constructor(config?: ChrxmeeBotOptions);

        readonly options: ChrxmeeBotOptions;
        token: string;
        prefix: string;
        user: { id: string; username: string; name: string; avatar: string } | null;
        application: BotApplication | null;
        connected: boolean;
        totalMessages: number;
        commands: Map<string, Function>;
        slashCommands: Map<string, { description: string; options: any[]; callback: Function }>;
        activity: { text: string; type: string; emoji: string } | null;
        status: string;
        uptime: number;

        // Filesystem
        readonly guilds: GuildManager;
        readonly users: UserManager;
        readonly videos: VideoManager;
        readonly notifications: NotificationManager;
        readonly plugins: PluginManager;
        readonly profiles: ProfileManager;
        readonly comments: CommentManager;

        // Methods
        login(): Promise<ChrxmeeBot>;
        command(name: string, callback: (ctx: CommandContext, args: string[]) => void | Promise<void>): ChrxmeeBot;
        slashCommand(name: string, description: string, options: any[], callback: (ctx: CommandContext, args: string[]) => void | Promise<void>): ChrxmeeBot;
        setActivity(text: string, type?: string, emoji?: string): ChrxmeeBot;
        setStatus(status: string): ChrxmeeBot;
        sendMessage(guildId: string, channelId: string, text: string): Promise<any>;
        sendDM(username: string, text: string): Promise<any>;
        joinGuild(inviteCode: string): Promise<boolean>;
        leaveGuild(guildId: string): Promise<void>;
        searchVideo(query: string): Promise<any[]>;
        getProfile(username: string): Promise<any>;
        getGuild(guildId: string): Promise<Guild | null>;
        destroy(): void;

        // Events
        on(event: 'ready', listener: () => void): this;
        on(event: 'message' | 'messageCreate', listener: (message: Message) => void): this;
        on(event: 'mention', listener: (message: Message) => void): this;
        on(event: 'dm', listener: (message: Message) => void): this;
        on(event: 'commandRun', listener: (commandName: string, ctx: CommandContext) => void): this;
        on(event: 'commandError', listener: (commandName: string, error: Error, ctx: CommandContext) => void): this;
        on(event: 'slashCommandRun', listener: (commandName: string, ctx: CommandContext) => void): this;
        on(event: 'slashCommandError', listener: (commandName: string, error: Error, ctx: CommandContext) => void): this;
        on(event: 'guildJoin', listener: (guild: Guild) => void): this;
        on(event: 'guildLeave', listener: (guild: Guild | any) => void): this;
        on(event: 'guildMemberCountChange', listener: (guild: Guild, newCount: number, oldCount: number) => void): this;
        on(event: 'guildAchievementUnlock', listener: (guild: Guild, achievement: Achievement) => void): this;
        on(event: 'guildTVStart', listener: (guild: Guild, tv: any) => void): this;
        on(event: 'guildTVEnd', listener: (guild: Guild) => void): this;
        on(event: 'voiceJoin', listener: (channel: VoiceChannel, user: User | string) => void): this;
        on(event: 'voiceLeave', listener: (channel: VoiceChannel, user: User | string) => void): this;
        on(event: 'voiceDJChange', listener: (channel: VoiceChannel, oldDJ: string | null, newDJ: string | null) => void): this;
        on(event: 'voiceVideoStart', listener: (channel: VoiceChannel, video: any) => void): this;
        on(event: 'voiceVideoEnd', listener: (channel: VoiceChannel, video: any) => void): this;
        on(event: 'voiceVideoChange', listener: (channel: VoiceChannel, newVideo: any, oldVideo: any) => void): this;
        on(event: 'voiceQueueUpdate', listener: (channel: VoiceChannel, queue: any[]) => void): this;
        on(event: 'activityChange', listener: (newActivity: any, oldActivity: any) => void): this;
        on(event: 'statusChange', listener: (newStatus: string, oldStatus: string) => void): this;
        on(event: 'notification', listener: (notification: Notification) => void): this;
        on(event: 'pluginInstall', listener: (plugin: Plugin) => void): this;
        on(event: 'pluginUninstall', listener: (plugin: Plugin) => void): this;
        on(event: 'rateLimited', listener: (type: string) => void): this;
        on(event: 'disconnect', listener: () => void): this;
        on(event: string, listener: (...args: any[]) => void): this;

        static Utils: typeof Utils;
        static Constants: any;
        static Permissions: typeof Permissions;
    }

    interface CommandContext {
        guild: Guild | null;
        channel: GuildChannel | null;
        member: GuildMember | null;
        author: User | null;
        content: string;
        reply(text: string): Promise<any>;
        send(text: string): Promise<any>;
        dm(text: string): Promise<any>;
        react(emoji: string): Promise<any>;
        voice: VoiceChannel | null;
    }

    export = ChrxmeeBot;
}
