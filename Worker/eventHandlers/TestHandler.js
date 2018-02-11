const EventHandler = require('../structures/EventHandler');

class TestHandler extends EventHandler {
	constructor(client) {
		super(client);
	}

	get name() {
		return 'test';
	}

	get canHandle() {
		return ['presenceUpdate'];
	}

	handle(event) {
		console.log(`PRESENCE -> @${event.user.id} [${event.status}]${event.game ? ` { name: ${event.game.name}, type: ${event.game.type} }` : ''}`);
	}
}

module.exports = TestHandler;
