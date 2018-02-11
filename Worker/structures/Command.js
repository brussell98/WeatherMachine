/**
 * A command that can be executed from messages
 * @abstract
 * @prop {String} name The command's name
 */
class Command {
	constructor(handler) {
		Object.defineProperty(this, 'client', { value: handler.client });
	}

	get name() {
		throw new Error('name not set');
	}

	/**
	 * Function that executes the command according to the passed arguments
	 * @param {Object} event The raw event
	 * @param {String} [args] The arguments specified by the user
	 * @abstract
	 */
	run(event, args) { } // eslint-disable-line no-unused-vars
}

module.exports = Command;
