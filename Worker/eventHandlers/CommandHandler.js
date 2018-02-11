const EventHandler = require('../structures/EventHandler');
const promisifyAll = require('tsubaki').promisifyAll;
const fs = promisifyAll(require('fs'));
const util = require('util');

class CommandHandler extends EventHandler {
	constructor(client) {
		super(client);

		this.commandPath = __dirname + '/../commands/';
		this.prefix = 'wm ';
		this.mentionRegex = new RegExp(`<@${process.env.BOT_ID}>`);

		this.commands = new Map();
	}

	get name() {
		return 'commands';
	}

	get canHandle() {
		return ['messageCreate'];
	}

	async init() {
		return await this.loadCommands();
	}

	handle(event) {
		try {
			console.log(`MESSAGE -> #${event.channel_id} @${event.author.username}: ${event.content}`);

			if (event.author.bot || event.author.id === process.env.BOT_ID)
				return;

			let command;
			if (this.mentionRegex.test(event.content))
				command = event.content.replace(/^[^ ]+ /, '').trim();
			else if (event.content.startsWith(this.prefix))
				command = event.content.substring(this.prefix.length).trim();
			else
				return;


			console.log(command);
			if (!command)
				return;

			const commandName = command.match(/^[^ ]+/)[0].toLowerCase();
			console.log(commandName);

			let matched = this.commands.get(commandName);
			if (matched)
				return matched.run(event, command.substring(commandName.length + 1));

			for (const c of this.commands.values())
				if (c.aliases && c.aliases.includes(commandName))
					return c.run(event, command.substring(commandName.length + 1));

			return;
		} catch (error) {
			console.error(error);
		}
	}

	async loadCommands() {
		const files = await fs.readdirAsync(this.commandPath);

		for (const file of files) {
			if (!file.endsWith('.js') || file.includes(' '))
				continue;

			const command = new (require(this.commandPath + file))(this);
			this.commands.set(command.name, command);
		}
	}
}

module.exports = CommandHandler;
