const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');

const userClient = require('../user-client');
const travelClient = require('../travel-client');

// Charger le fichier proto (attention au package "recommendation")
const protoPath = path.join(__dirname, '../recommendation.proto');
const packageDef = protoLoader.loadSync(protoPath, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true
});

const grpcObject = grpc.loadPackageDefinition(packageDef);

// Utiliser le bon package : "recommendation" (anglais)
const recommendationPackage = grpcObject.recommendation;

// Implémentation du service
const recommendationService = {
  GetRecommendations: (call, callback) => {
    const { userId } = call.request;

    if (!userId) {
      return callback({
        code: grpc.status.INVALID_ARGUMENT,
        details: "userId is required"
      });
    }

    console.log(`Fetching preferences for user: ${userId}`);

    userClient.GetUser({ id: userId }, (userErr, userRes) => {
      if (userErr) {
        console.error('User fetch error:', userErr);
        return callback({
          code: grpc.status.NOT_FOUND,
          details: "User not found"
        });
      }

      const userPreferences = userRes.preferences || [];
      console.log(`User preferences: ${userPreferences}`);

      travelClient.GetAllTravels({}, (travelErr, travelRes) => {
        if (travelErr) {
          console.error('Travel fetch error:', travelErr);
          return callback({
            code: grpc.status.INTERNAL,
            details: "Error fetching travels"
          });
        }

        console.log(`Fetched ${travelRes.travels.length} travels.`);

        // Filtrer selon préférences utilisateur
        const recommendedTravels = travelRes.travels.filter(travel =>
          userPreferences.includes(travel.type)
        );

        console.log(`Recommended travels: ${recommendedTravels.length}`);

        return callback(null, { travels: recommendedTravels });
      });
    });
  }
};

// Création et lancement du serveur gRPC
const server = new grpc.Server();

// Attention ici, correspondance exacte au service dans le proto
server.addService(recommendationPackage.RecommendationService.service, recommendationService);

server.bindAsync('0.0.0.0:50053', grpc.ServerCredentials.createInsecure(), () => {
  console.log("✅ Recommendation Service is running on port 50053");
  server.start();
});
