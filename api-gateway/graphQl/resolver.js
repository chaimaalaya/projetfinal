const travelClient = require('../travel-client');
const userClient = require('../user-client');
const recommendationClient = require('../recommendation-client');

const resolvers = {
  Query: {
    getAllTravels: async () => {
      return new Promise((resolve, reject) => {
        travelClient.GetAllTravels({}, (err, response) => {
          if (err) return reject(err);
          resolve(response.travels); // array of Travel
        });
      });
    },

    getTravel: async (_, { id }) => {
      return new Promise((resolve, reject) => {
        travelClient.GetTravel({ id }, (err, response) => {
          if (err) return reject(err);
          resolve(response);
        });
      });
    },

    getUser: async (_, { id }) => {
      return new Promise((resolve, reject) => {
        userClient.GetUser({ id }, (err, response) => {
          if (err) return reject(err);
          resolve(response);
        });
      });
    },

   getRecommendations: async (_, { userId }) => {
  try {
    // 1. Récupérer l'utilisateur
    const user = await new Promise((resolve, reject) => {
      userClient.GetUser({ id: userId }, (err, data) => {
        if (err) reject(err);
        else resolve(data);
      });
    });

    // 2. Récupérer tous les voyages
    const allTravels = await new Promise((resolve, reject) => {
      travelClient.GetAllTravels({}, (err, data) => {
        if (err) reject(err);
        else resolve(data.travels);
      });
    });

    // 3. Filtrer les voyages selon les préférences
    const filteredTravels = allTravels.filter(travel =>
      user.preferences.some(pref => {
        if (!pref) return false; // Ignore préférences vides
        const prefLower = pref.toLowerCase();
        return (
          travel.name.toLowerCase().includes(prefLower) ||
          travel.type.toLowerCase().includes(prefLower) ||
          travel.weather.toLowerCase().includes(prefLower)
        );
      })
    );

    // 4. Retourner la liste filtrée
    return filteredTravels;
  } catch (error) {
    console.error("Erreur dans getRecommendations:", error);
    throw new Error("Erreur lors de la récupération des recommandations");
  }
}

  },

 Mutation: {
    addTravel: async (_, { name, type, weather }) => {
      return new Promise((resolve, reject) => {
        travelClient.PostTravel({ name, type, weather }, async (err, response) => {
          if (err) return reject(err);
          resolve(response);
          
   
          try {
            await sendMessage('travel-events', [{ event: 'TravelAdded', travel: response }]);
            console.log('Event TravelAdded envoyé à Kafka');
          } catch (error) {
            console.error('Erreur en envoyant l’event Kafka:', error);
          }
        });
      });
    },

    createUser: async (_, { name, email, preferences }) => {
      return new Promise((resolve, reject) => {
        userClient.PostUser({ name, email, preferences }, async (err, response) => {
          if (err) return reject(err);
          resolve(response);

      
          try {
            await sendMessage('user-events', [{ event: 'UserCreated', user: response }]);
            console.log('Event UserCreated envoyé à Kafka');
          } catch (error) {
            console.error('Erreur en envoyant l’event Kafka:', error);
          }
        });
      });
    }
  }
};

module.exports = resolvers;