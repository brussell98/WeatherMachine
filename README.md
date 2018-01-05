# WeatherMachine
A proof-of-concept bot using the WeatherStack

## Requirements

WeatherMachine uses an AMQP message queue. I'd recommend using the [RabbitMQ](https://www.rabbitmq.com/) server for this. You'll also need [Redis](https://redis.io/) for the cache, and if you dont have Node then that's kind of important.

## How to run

First you'll need to connect to the Discord gateway to start receiving events. To do this run `Gateway/index.js` with the required arguments.

```bash
node ./Gateway/index.js --firstShard 0 --lastShard 5
# or
node ./Gateway/index.js --numShards 6
```

After that you need to start a cache worker and run the bot, but I'm not that far in yet, so have a cat girl: ![New Years cat girl](https://nekos.brussell.me/image/rJOuxDdQf)
## TODO

- Fully-functioning bot
- Micro-service
- Voice
