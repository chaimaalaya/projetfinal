const { Kafka } = require('kafkajs');

const kafka = new Kafka({
  clientId: 'api-gateway',
  brokers: ['kafka:29092'] // ⚠️ Très important que ce soit bien ça !
});

const producer = kafka.producer();

const sendUserCreatedEvent = async (user) => {
  await producer.connect();
  console.log('✅ Kafka producer connecté');
  
  await producer.send({
    topic: 'user-events',
    messages: [{ value: JSON.stringify({ event: 'USER_CREATED', data: user }) }]
  });
  console.log('✅ Événement USER_CREATED envoyé avec succès');
};

module.exports = { sendUserCreatedEvent };
