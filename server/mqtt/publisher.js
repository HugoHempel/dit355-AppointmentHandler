const mqtt = require('mqtt');
const dotenv = require('dotenv');

let eventID = 0;

dotenv.config();

let client;

connect = async () => {
    client = mqtt.connect({
        host: process.env.MQTT_HOST,
        port: process.env.MQTT_PORT
    });
    
    client.on('connect', (err) => {
        if (err.errorCode === -1) return console.error(err);
    });
};

const publish = async (topic, message, qos = 0) => {
    if (client) {
        try {
            client.publish('dentistimo/' + topic, message, qos);
            client.publish('dentistimo/log/general', `Published message: ${message}. Event ID: ${eventID}`, 1);

        } catch (err) {
            client.publish('dentistimo/log/error', `ERROR: ${error}. Event ID: ${eventID}`, 1);
        }
        eventID++;
    } else {
        await connect(); // If no publisher client exists, wait until connected then call publish again.
        publish(topic, message);
    }
};

module.exports.publish = publish;