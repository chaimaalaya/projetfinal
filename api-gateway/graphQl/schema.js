const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type Travel {
    id: ID!
    name: String!
    type: String!
    
    weather: String!
  }

  type User {
    id: ID!
    name: String!
     email: String!
    preferences: [String!]!
  }

  type Query {
    getAllTravels: [Travel!]!
    getTravel(id: ID!): Travel
    getUser(id: ID!): User
    getRecommendations(userId: ID!): [Travel!]!
  }

  type Mutation {
    addTravel(name: String!, type: String!, weather: String!): Travel!
    createUser(name: String!, email: String!, preferences: [String!]!): User!

  }
`;

module.exports = typeDefs;
