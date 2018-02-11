const WeatherMachine = require('./WeatherMachine');

const wm = new WeatherMachine({ camelCaseEvents: true });

async function run() {
	console.log('[WeatherMachine:Startup] Starting');
	await wm.initialize();

	console.log('[WeatherMachine:Startup] Ready');
	// wm.on('messageCreate', data => {
	// 	return handleMessage(data);
	// });
}

// async function handleMessage(msg) {
// 	const channel = await wm.cache.channel.get(msg.channel_id);
// 	console.log(`[WeatherMachine:Message] ${channel.name}: ${msg.author.username}#${msg.author.discriminator}: ${msg.content}`);

// 	if (msg.content.startsWith('$status = ')) {
// 		const status = msg.content.substr(10);

// 		wm.connector.sendToGateway({
// 			t: 'STATUS_UPDATE',
// 			d: { game: { name: status, type: 0 } }
// 		});

// 		return wm.rest.channel.createMessage(channel.id, `Setting status to "${status}"`);
// 	}
// }

run().catch(error => console.error('[WeatherMachine:Startup]', error));
