// *************** IMPORT CORE ***************
const express = require('express');
const { ApolloServer } = require('apollo-server-express');

// *************** IMPORT MODULE ***************
const connection = require('./models/connection');
const graphqlConfig = require('./api');

const app = express();
const port = 3000;

const server = new ApolloServer(graphqlConfig); // *************** Initializes ApolloServer with GraphQL configuration

server.applyMiddleware({ app }); // *************** Apply ApolloServer to the Express app.

// *************** Starts the Express server
app.listen(port, async () => {
  console.log(await connection);
  console.log(`GraphQL server is running on http://localhost:${port}/graphql`);
});
