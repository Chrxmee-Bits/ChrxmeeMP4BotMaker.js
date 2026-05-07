// src/Commands.js — Command Handler
class Commands {
    constructor(client) {
        this.client = client;
        this.registered = new Map();
        this.slashCommands = new Map();
    }

    register(name, callback) {
        this.registered.set(name.toLowerCase(), callback);
    }

    slash(name, options, callback) {
        this.slashCommands.set(name.toLowerCase(), { options, callback });
    }

    async handle(message) {
        const prefix = this.client.prefix;
        
        // Handle prefix commands
        if (message.text && message.text.startsWith(prefix)) {
            const args = message.text.slice(prefix.length).trim().split(/\s+/);
            const commandName = args.shift().toLowerCase();
            const command = this.registered.get(commandName);
            if (command) {
                command({
                    reply: (text) => this.client.sendMessage(message.guildId, message.channelId, text),
                    args,
                    author: message.from,
                    guildId: message.guildId,
                    channelId: message.channelId
                }, args);
            }
        }
        
        // Handle mentions
        if (message.text && message.text.includes(`@${this.client.user.name}`)) {
            this.client.emit('mention', {
                reply: (text) => this.client.sendMessage(message.guildId, message.channelId, text),
                author: message.from,
                guildId: message.guildId
            });
        }
    }

    // Slash command builder
    buildSlashCommand(name, description, options = []) {
        return {
            name: name.toLowerCase(),
            description,
            options: options.map(opt => ({
                name: opt.name,
                description: opt.description,
                type: opt.type || 'string',
                required: opt.required !== false
            }))
        };
    }
}

module.exports = Commands;
