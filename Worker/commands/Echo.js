const Command = require('../structures/Command');

class Echo extends Command {
	constructor(handler) {
		super(handler);
	}

	get name() {
		return 'echo';
	}

	get aliases() {
		return ['say'];
	}

	run(event, args) {
		console.log(`ECHO -> ${args}`);

		args = args.trim();
		return this.client.rest.channel.createMessage(event.channel_id, args || 'echo!');
	}
}

module.exports = Echo;
