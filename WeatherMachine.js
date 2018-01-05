require("bluebird");
require('dotenv').config();

const EventEmitter = require('eventemitter3');
// const { } = require('./Constants');
const { camelCaseEventName } = require('./utils');
const SnowTransfer = require('snowtransfer');
const RainCache = require('raincache');
const AmqpConnector = require('./AqmpConnector');

class WeatherMachine extends EventEmitter {
	constructor(options = { }) {
		super();

		if (options.disabledEvents)
			options.disabledEvents = new Set(options.disabledEvents);

		this.options = Object.assign({
			disabledEvents: null,
			camelCaseEvents: false
		}, options);

		this.cache = new RainCache({
			storage: { default: new RainCache.Engines.RedisStorageEngine({ password: process.env.REDIS_PASS }) },
			debug: false
		});
		this.rest = new SnowTransfer(process.env.BOT_TOKEN);
		this.connector = new AmqpConnector(this);
	}

	async initialize() {
		await this.cache.initialize();
		await this.connector.initialize();

		this.connector.on('event', event => {
			this.processEvent(event);
		});
	}

	processEvent(event) {
		if (this.options.disabledEvents && this.options.disabledEvents.has(event.t))
			return null;

		return this.emit(this.options.camelCaseEvents ? camelCaseEventName(event.t) : event.t, event.d);
	}
}

module.exports = WeatherMachine;
