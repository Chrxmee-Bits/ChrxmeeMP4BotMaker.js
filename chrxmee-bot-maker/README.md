# Chrxmee-MP4 Bot Maker

The official bot framework for [Chrxmee-MP4](https://chrxmee-mp4-player.vercel.app) — build bots that interact with guilds, voice channels, videos, economy, and more.

```bash
npm install chrxmee-mp4-bot-maker
```

---

## Quick Start

```js
const ChrxmeeBot = require('chrxmee-mp4-bot-maker');
const bot = new ChrxmeeBot({ token: 'chrx_bot_xxxx', prefix: '!' });

bot.on('ready', () => {
    console.log(`${bot.application.name} is online!`);
});

bot.command('ping', (ctx) => {
    ctx.reply('Pong! 🏓');
});

bot.login();
```

---

## Features

- Full guild system — create, manage, and moderate guilds
- Channels — text, voice, stage, radio, and TV
- Voice channels with DJ system, video queue, and synced playback
- Role-based permissions (admin, mod, DJ, member)
- Watch parties and TV scheduling
- Economy system — coins, guild bank, shop
- Guild achievements and boost levels
- Video library search and comments
- Plugin marketplace integration
- Notification system
- Invite management
- Rate limiting built in
- Zero dependencies

---

## Connecting to Chrxmee-MP4

1. Create a bot at the [Developer Portal](https://chrxmee-mp4-player.vercel.app/developers)
2. Wait for approval
3. Copy your token
4. Write your bot code
5. Deploy via the Developer Portal

Your bot runs on Chrxmee-MP4's infrastructure. The package provides the development API — actual execution happens on the platform.

---

## Example Bots

### Moderation Bot
```js
bot.command('kick', async (ctx, args) => {
    if (!ctx.member.isMod) return ctx.reply('No permission.');
    const target = args[0];
    await ctx.guild.members.kick(target);
    ctx.reply(`Kicked ${target}.`);
});

bot.command('ban', async (ctx, args) => {
    if (!ctx.member.isAdmin) return ctx.reply('No permission.');
    const target = args[0];
    await ctx.guild.members.ban(target);
    ctx.reply(`Banned ${target}.`);
});
```

### Music Bot
```js
bot.command('play', async (ctx, args) => {
    const vc = ctx.guild.channels.find(c => c.type === 'voice');
    if (!vc) return ctx.reply('No voice channel found.');
    await vc.join();
    await vc.play({ title: args.join(' '), src: 'video-url-here' });
    ctx.reply('Now playing! 🎵');
});

bot.command('skip', async (ctx) => {
    const vc = ctx.voice;
    if (!vc) return ctx.reply('Not in a voice channel.');
    if (vc.currentDJ?.id !== ctx.author.id) return ctx.reply('Only DJ can skip.');
    await vc.skip();
    ctx.reply('Skipped! ⏭️');
});
```

### Economy Bot
```js
bot.command('daily', async (ctx) => {
    const coins = await ctx.guild.economy.rewardDaily(ctx.author.username);
    ctx.reply(`You claimed 25 coins! Balance: ${coins} 💰`);
});

bot.command('balance', async (ctx) => {
    const coins = ctx.guild.economy.getCoins(ctx.author.username);
    ctx.reply(`You have ${coins} coins 💰`);
});

bot.command('leaderboard', async (ctx) => {
    const lb = ctx.guild.economy.getLeaderboard();
    const text = lb.map((e, i) => `${i + 1}. @${e[0]} — ${e[1].coins} 💰`).join('\n');
    ctx.reply(`**Richest Members**\n${text}`);
});
```

### Fun Bot
```js
bot.command('8ball', (ctx, args) => {
    const responses = [
        'Yes.', 'No.', 'Maybe.', 'Ask again later.',
        'Definitely.', 'Not a chance.', 'I think so.'
    ];
    const answer = responses[Math.floor(Math.random() * responses.length)];
    ctx.reply(`🎱 ${answer}`);
});
```

---

## API Reference

### Client Properties

| Property | Type | Description |
|----------|------|-------------|
| `bot.guilds` | GuildManager | All guilds the bot is in |
| `bot.users` | UserManager | Cached users |
| `bot.videos` | VideoManager | Video library access |
| `bot.plugins` | PluginManager | Plugin marketplace |
| `bot.notifications` | NotificationManager | Notification system |
| `bot.profiles` | ProfileManager | User profiles |
| `bot.comments` | CommentManager | Video comments |
| `bot.application` | BotApplication | Bot's own registration data |
| `bot.connected` | boolean | Whether bot is connected |
| `bot.uptime` | number | Milliseconds since login |
| `bot.prefix` | string | Command prefix |

### Client Methods

| Method | Description |
|--------|-------------|
| `bot.login()` | Connect to Chrxmee-MP4 |
| `bot.command(name, callback)` | Register a prefix command |
| `bot.slashCommand(name, desc, opts, callback)` | Register a slash command |
| `bot.setActivity(text, type, emoji)` | Set bot activity status |
| `bot.setStatus(status)` | Set bot status (online/idle/dnd/offline) |
| `bot.sendMessage(guildId, channelId, text)` | Send a message |
| `bot.sendDM(username, text)` | Send a direct message |
| `bot.joinGuild(inviteCode)` | Join a guild via invite |
| `bot.leaveGuild(guildId)` | Leave a guild |
| `bot.searchVideo(query)` | Search video library |
| `bot.destroy()` | Disconnect and stop all polling |

### Guild

| Property/Method | Description |
|----------------|-------------|
| `guild.name` | Guild name |
| `guild.owner` | Owner GuildMember |
| `guild.members` | GuildMemberManager |
| `guild.channels` | ChannelManager |
| `guild.roles` | RoleManager |
| `guild.invites` | InviteManager |
| `guild.economy` | EconomyManager |
| `guild.watchParties` | WatchPartyManager |
| `guild.tvSchedule` | TVScheduleManager |
| `guild.achievements` | AchievementManager |
| `guild.emojis` | EmojiManager |
| `guild.stickers` | StickerManager |
| `guild.events` | EventManager |
| `guild.level` | Guild level |
| `guild.boostLevel` | Boost tier (boost1/boost2/boost3) |
| `guild.memberCount` | Total members |
| `guild.me` | Bot's GuildMember instance |
| `guild.leave()` | Leave this guild |
| `guild.createInvite(options)` | Create an invite |

### GuildChannel / TextChannel / VoiceChannel

| Property/Method | Description |
|----------------|-------------|
| `channel.name` | Channel name |
| `channel.type` | text/voice/stage/radio/tv |
| `channel.topic` | Channel topic |
| `channel.messages` | MessageManager |
| `channel.send(content)` | Send a message |
| `channel.bulkDelete(count)` | Delete multiple messages |
| `vc.join()` | Join voice channel |
| `vc.leave()` | Leave voice channel |
| `vc.play(video)` | Play a video (DJ only) |
| `vc.skip()` | Skip current video (DJ only) |
| `vc.pause()` | Pause playback (DJ only) |
| `vc.resume()` | Resume playback (DJ only) |
| `vc.seek(seconds)` | Seek in current video (DJ only) |
| `vc.setDJ(username)` | Set a new DJ |
| `vc.currentDJ` | Current DJ info |
| `vc.queue` | VoiceQueue for managing playlist |
| `vc.participants` | Array of users in VC |
| `vc.isPlaying` | Whether video is playing |

### GuildMember

| Property/Method | Description |
|----------------|-------------|
| `member.username` | Username |
| `member.role` | Role name |
| `member.displayName` | Nickname or username |
| `member.isOwner` | Is guild owner |
| `member.isAdmin` | Is admin or owner |
| `member.isMod` | Is mod or higher |
| `member.hasPermission(perm)` | Check specific permission |
| `member.kick()` | Kick member |
| `member.ban()` | Ban member |
| `member.setRole(role)` | Change member role |
| `member.setNickname(nick)` | Set nickname |
| `member.mute()` | Mute member |
| `member.unmute()` | Unmute member |

### Message

| Property/Method | Description |
|----------------|-------------|
| `message.content` | Message text |
| `message.author` | User who sent it |
| `message.guild` | Guild it was sent in |
| `message.channel` | Channel it was sent in |
| `message.member` | GuildMember who sent it |
| `message.reply(content)` | Reply to the message |
| `message.edit(content)` | Edit the message |
| `message.delete()` | Delete the message |
| `message.react(emoji)` | Add a reaction |
| `message.pin()` | Pin the message |
| `message.unpin()` | Unpin the message |

### EconomyManager

| Method | Description |
|--------|-------------|
| `economy.getCoins(username)` | Get user's balance |
| `economy.getBank()` | Get guild bank balance |
| `economy.addCoins(username, amount)` | Add coins to user |
| `economy.spendCoins(username, amount, item)` | Spend coins |
| `economy.addToBank(amount)` | Add to guild bank |
| `economy.spendFromBank(amount)` | Spend from guild bank |
| `economy.getLeaderboard()` | Top 10 richest users |
| `economy.rewardMessage(username)` | Give 1 coin for a message |
| `economy.rewardDaily(username)` | Give 25 daily coins |

---

## Events

| Event | Parameters | Description |
|-------|-----------|-------------|
| `ready` | — | Bot connected and ready |
| `messageCreate` | message | New message received |
| `mention` | message | Bot was @mentioned |
| `dm` | message | Direct message received |
| `commandRun` | name, ctx | Command was executed |
| `commandError` | name, error, ctx | Command threw an error |
| `guildJoin` | guild | Bot joined a guild |
| `guildLeave` | guild | Bot left a guild |
| `guildMemberCountChange` | guild, new, old | Member count changed |
| `guildAchievementUnlock` | guild, achievement | Achievement unlocked |
| `guildTVStart` | guild, tv | TV broadcast started |
| `guildTVEnd` | guild | TV broadcast ended |
| `voiceJoin` | channel, user | User joined VC |
| `voiceLeave` | channel, user | User left VC |
| `voiceDJChange` | channel, oldDJ, newDJ | DJ changed |
| `voiceVideoStart` | channel, video | Video started playing |
| `voiceVideoEnd` | channel, video | Video ended |
| `voiceQueueUpdate` | channel, queue | Queue was modified |
| `activityChange` | newActivity, oldActivity | Bot activity changed |
| `statusChange` | newStatus, oldStatus | Bot status changed |
| `notification` | notification | New notification |
| `pluginInstall` | plugin | Plugin installed |
| `pluginUninstall` | plugin | Plugin uninstalled |
| `rateLimited` | type | Rate limit hit |
| `disconnect` | — | Bot disconnected |

---

## Context Object

Commands receive a context object with:

```js
{
    guild,        // Guild instance (null in DMs)
    channel,      // Channel instance
    member,       // GuildMember who ran command
    author,       // User who ran command
    content,      // Raw message text
    voice,        // VoiceChannel if in VC, else null
    reply(text),  // Reply to the message
    send(text),   // Send to the channel
    dm(text),     // DM the user
    react(emoji)  // React to the message
}
```

---

## Local Development

The package includes in-memory storage for local testing. Real data is only accessible when deployed on Chrxmee-MP4.

```bash
git clone https://github.com/your-username/my-bot
cd my-bot
npm install chrxmee-mp4-bot-maker
node bot.js
```

Token verification and live data require deployment through the [Developer Portal](https://chrxmee-mp4-player.vercel.app/developers).

---

## Links

- [Platform](https://chrxmee-mp4-player.vercel.app)
- [Developer Portal](https://chrxmee-mp4-player.vercel.app/developers)
- [Plugin Marketplace](https://chrxmee-mp4-player.vercel.app/plugins)
- [GitHub](https://github.com/chrxmee-bits)

---

## Security

See SECURITY.md for vulnerability reporting. This package has zero dependencies — vulnerabilities can only exist in the package itself.

---

## License

MIT — Chrxmee
