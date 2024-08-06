// *************** IMPORT CORE ***************
const express = require('express');

const { ApolloServer } = require('apollo-server-express');
// const { makeExecutableSchema } = require('graphql-tools');
// const { applyMiddleware } = require('graphql-middleware');

// *************** IMPORT MODULE ***************
const conn = require('./models/connection');
const graphqlConfig = require('./api');

const app = express();
const port = 3000;
// const executableSchema = makeExecutableSchema({ typeDefs, resolvers });
// const protectedSchema = applyMiddleware(executableSchema);

const server = new ApolloServer(graphqlConfig);

server.applyMiddleware({ app });

app.listen(port, async () => {
  console.log(await conn);
  console.log(`GraphQL server is running on http://localhost:${port}/graphql`);
});
