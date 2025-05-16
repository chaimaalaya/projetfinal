const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { ApolloServer } = require('apollo-server-express');
const userClient = require('./user-client');
const travelClient = require('./travel-client');
const recommendationClient = require('./recommendation-client'); 
const typeDefs = require('./graphQl/schema');
const resolvers = require('./graphQl/resolver');

const app = express();


app.use(cors());

const server = new ApolloServer({ typeDefs, resolvers });

async function startApolloServer() {
  await server.start();

  
  server.applyMiddleware({ app });


  app.use(bodyParser.json());


  app.post('/users', (req, res) => {
    userClient.PostUser(req.body, (err, data) => {
      if (err) return res.status(500).send(err.message);
      res.json(data);
    });
  });

  app.get('/users/:id', (req, res) => {
    userClient.GetUser({ id: req.params.id }, (err, data) => {
      if (err) return res.status(404).send(err.message);
      res.json(data);
    });
  });

  app.post('/travels', (req, res) => {
    travelClient.PostTravel(req.body, (err, data) => {
      if (err) return res.status(500).send(err.message);
      res.json(data);
    });
  });

  app.get('/travels/:id', (req, res) => {
    travelClient.GetTravel({ id: req.params.id }, (err, data) => {
      if (err) return res.status(404).send(err.message);
      res.json(data);
    });
  });

  app.get('/travels', (req, res) => {
    travelClient.GetAllTravels({}, (err, data) => {
      if (err) return res.status(500).send(err.message);
      res.json(data.travels); 
    });
  });

  app.get('/recommendations/:userId', (req, res) => {
    const userId = req.params.userId;
    recommendationClient.GetRecommendations({ userId }, (err, data) => {
      if (err) {
        console.error('Error in RecommendationService:', err);
        return res.status(500).send(err.details || 'Error fetching recommendations');
      }
      res.json(data.travels);
    });
  });

  app.listen(3000, () => {
    console.log(`🚀 API Gateway running at http://localhost:3000`);
    console.log(`🚀 GraphQL endpoint at http://localhost:3000${server.graphqlPath}`);
  });
}

startApolloServer();
