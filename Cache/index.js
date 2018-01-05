require("bluebird");
require('dotenv').config();

const RainCache = require('raincache');

const amqp = new RainCache.Connectors.AmqpConnector({
	amqpUrl: process.env.AMQP_URL || 'amqp://localhost',
	amqpQueue: 'weather-pre-cache',
	sendQueue: 'weather-events'
});
const redis = new RainCache.Engines.RedisStorageEngine({ password: process.env.REDIS_PASS });

const cache = new RainCache({ storage: { default: redis }, debug: false }, amqp, amqp);

async function run() {
	console.log('[STARTUP] Starting RainCache');
	await cache.initialize();

	cache.on('error', error => console.error('[GW:ERROR]', error));
	console.log('[STARTUP] RainCache worker running');
}

run().catch(error => console.error('[STARTUP] Error during startup:\n', error));
