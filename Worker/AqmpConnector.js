const EventEmitter = require('eventemitter3');
const amqp = require('amqplib');

class AmqpConnector extends EventEmitter {
	constructor(client) {
		super();

		this.client = client;
		this.connection = null;
		this.channel = null;
	}

	async initialize() {
		this.connection = await amqp.connect(process.env.AMQP_URL || 'amqp://localhost');
		this.channel = await this.connection.createChannel();

		this.emit('ready');

		this.channel.assertQueue('weather-events', { durable: false, messageTtl: 60e3 });
		this.channel.consume('weather-events', async event => {
			await this.channel.ack(event);

			this.emit('event', JSON.parse(event.content.toString()));
		});
	}

	async sendToGateway(event) {
		return await this.channel.sendToQueue('weather-gateway-requests', Buffer.from(JSON.stringify(event)));
	}
}

module.exports = AmqpConnector;
