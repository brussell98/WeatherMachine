require("bluebird");
require('dotenv').config({ path: __dirname + '/../.env' });

const { parseArgs } = require('../utils');
const CloudStorm = require('Cloudstorm');
const amqp = require('amqplib');

const args = parseArgs();

const bot = new CloudStorm(process.env.BOT_TOKEN, {
	initialPresence: {
		status: 'online',
		game: { name: 'the weather', type: 3 } // Watching the weather
	},
	firstShardId: args.firstShard || 0,
	lastShardId: args.lastShard || (args.numShards ? args.numShards - 1 : 0),
	shardAmount: args.numShards || (args.firstShard && args.lastShard ? args.lastShard - args.firstShard + 1 : 1)
});

async function run() {
	console.log('[STARTUP] Starting CloudStorm');
	const connection = await amqp.connect(process.env.AMQP_URL || 'amqp://localhost');
	const channel = await connection.createChannel();

	await bot.connect();

	bot.on('error', error => console.error('[GW:ERROR]', error));
	bot.on('ready', () => console.log('[GW:LOG] Connected to gateway'));

	// Send events to cache worker
	channel.assertQueue('weather-pre-cache', { durable: false, autoDelete: true });
	bot.on('event', event => channel.sendToQueue('weather-pre-cache', Buffer.from(JSON.stringify(event))));

	// Receive requests from bot
	channel.assertQueue('weather-gateway-requests', { durable: false, autoDelete: true });
	channel.consume('weather-gateway-requests', event => {
		return processRequest(JSON.parse(event.content.toString()));
	});
}

function processRequest(event) {
	switch (event.t) {
		case 'STATUS_UPDATE':
			bot.statusUpdate(Object.assign({ status: 'online' }, event.d));
			break;
		default:
			break;
	}

	return null;
}

run().catch(error => console.error('[STARTUP] Error during startup:\n', error));
