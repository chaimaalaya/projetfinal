Description
ProjectMS est une architecture microservices complète pour la gestion d'utilisateurs, recommandations et voyages. Le projet utilise Kafka pour la communication asynchrone, gRPC pour les appels synchrones, et Docker pour la conteneurisation des services.

 Technologies utilisées :
Node.js (Express, KafkaJS, gRPC)

Apache Kafka (avec Zookeeper)

gRPC (communication entre services)

Docker & Docker Compose

GraphQL (API Gateway)

 Structure du projet
graphql
Copier
Modifier
ProjectMS/
├── api-gateway/         # API Gateway avec GraphQL
├── recommendation/      # Microservice des recommandations (gRPC + Kafka)
├── service_user/        # Microservice de gestion des utilisateurs (gRPC + Kafka)
├── travel-service/      # Microservice de gestion des voyages (gRPC + Kafka)
├── kafka/               # Producteurs/consommateurs Kafka
├── docker-compose.yml   # Orchestration des services
└── README.md            # Ce fichier
