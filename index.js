const Scaledrone = require('scaledrone-node');
const log = require('tracer').colorConsole();

const CHANNEL_ID = process.env.CHANNEL;
const ROOM = 'roundtrip';

if (!CHANNEL_ID) {
  log.error('Please provide the CHANNEL environment variable');
  process.exit(1);
}

log.info('Sending messages to and receving them back from Scaledrone');

const drone = new Scaledrone(CHANNEL_ID);
drone.on('error', error => log.error('Error with connection:', error));
drone.on('close', event => log.log('Connection closed:', event));

const room = drone.subscribe(ROOM);
room.on('open', error => {
  if (error) {
    return log.error(error);
  }
  startSending();
});
room.on('data', ({time}) => {
  log.debug(`Received sent message. Roundtrip time: ${Date.now() - time}ms`);
});

function startSending() {
  log.info('Starting..');
  setInterval(() => {
    drone.publish({
      room: ROOM,
      message: {time: Date.now()}
    });
  }, 1000);
}
