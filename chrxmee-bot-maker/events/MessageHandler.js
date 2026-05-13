const Message = require('../structures/Message');

class MessageHandler {
    constructor(client) {
        this.client = client;
        this.processedIds = new Set();
    }

    async handle(rawMessage) {
        if (!this.client.connected) return;

        const message = new Message(this.client, rawMessage);

        // Avoid processing own messages
        if (message.authorId === this.client.user.id) return;

        // Avoid duplicates
        if (this.processedIds.has(message.id)) return;
        this.processedIds.add(message.id);

        // Cleanup old processed IDs
        if (this.processedIds.size > 1000) {
            const arr = [...this.processedIds];
            this.processedIds = new Set(arr.slice(-500));
        }

        // Emit message event
        this.client.emit('messageCreate', message);

        // Handle commands
        if (!this.client.options.disableCommands && message.content) {
            await this.handleCommand(message);
        }

        // Mention detection
        if (message.content && message.content.includes(`@${this.client.application.name}`)) {
            this.client.emit('mention', message);
        }

        // DM detection
        if (!message.guildId) {
            this.client.emit('dm', message);
        }
    }

    async handleCommand(message) {
        if (!message.content) return;

        const prefix = this.client.prefix;

        // Prefix commands
        if (message.content.startsWith(prefix)) {
            const args = message.content.slice(prefix.length).trim().split(/\s+/);
            const cmdName = args.shift().toLowerCase();
            const cmd = this.client.commands.get(cmdName);

            if (cmd) {
                const ctx = this.client._createContext(message);
                try {
                    await cmd(ctx, args);
                    this.client.emit('commandRun', cmdName, ctx);
                } catch (err) {
                    this.client.emit('commandError', cmdName, err, ctx);
                }
            }
        }

        // Slash commands
        if (message.content.startsWith('/')) {
            const parts = message.content.slice(1).trim().split(/\s+/);
            const cmdName = parts.shift().toLowerCase();
            const slashCmd = this.client.slashCommands.get(cmdName);

            if (slashCmd) {
                const ctx = this.client._createContext(message);
                try {
                    await slashCmd.callback(ctx, parts);
                    this.client.emit('slashCommandRun', cmdName, ctx);
                } catch (err) {
                    this.client.emit('slashCommandError', cmdName, err, ctx);
                }
            }
        }
    }
}

module.exports = MessageHandler;
