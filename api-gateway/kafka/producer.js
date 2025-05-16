// producer.js
const { Kafka } = require('kafkajs');

const kafka = new Kafka({
  clientId: 'recommendation-service',
  brokers: [process.env.KAFKA_BROKERS || 'localhost:9092'],
});

const producer = kafka.producer();

const startProducer = async () => {
  try {
    await producer.connect();
    console.log('✅ Kafka producer connecté');
  } catch (error) {
    console.error('❌ Erreur de connexion du producer Kafka:', error);
    process.exit(1);
  }
};


startProducer();

const sendUserCreatedEvent = async (user) => {
  try {
    await producer.send({
      topic: 'user-events',
      messages: [
        {
          value: JSON.stringify({
            event: 'USER_CREATED',
            data: user,
          }),
        },
      ],
    });
    console.log('✅ Événement USER_CREATED envoyé avec succès');
  } catch (error) {
    console.error('❌ Erreur lors de l’envoi de l’événement Kafka:', error);
  }
};

// Optionnel : gérer la déconnexion propre à la fermeture du process
process.on('SIGINT', async () => {
  console.log('Fermeture du producer Kafka...');
  await producer.disconnect();
  process.exit();
});
if (require.main === module) {
  sendUserCreatedEvent({ id: '1', name: 'Test User' });
}
module.exports = { sendUserCreatedEvent }