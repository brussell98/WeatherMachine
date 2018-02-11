/**
 * Handles a set of events from the broker
 * @abstract
 * @prop {String} name The handler's name
 * @prop {Array<String>} canHandle An array of events that this can handle
 */
class EventHandler {
	constructor(client) {
		Object.defineProperty(this, 'client', { value: client });
	}

	get name() {
		throw new Error('name not set');
	}

	get canHandle() {
		throw new Error('canHandle not set');
	}

	/**
	 * Function to handle incoming events
	 * @param {Object} event The raw event
	 * @abstract
	 */
	handle(event) { } // eslint-disable-line no-unused-vars
}

module.exports = EventHandler;
