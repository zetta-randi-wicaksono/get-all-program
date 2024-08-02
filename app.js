const express = require('express');
const bodyParser = require('body-parser');

const { ApolloServer } = require('apollo-server-express');
const { makeExecutableSchema } = require('graphql-tools');
const { applyMiddleware } = require('graphql-middleware');

const conn = require('./models/connection');
const typeDefs = require('./typeDefs');
const resolvers = require('./resolvers');
const specialityLoader = require('./data_loader/specialityLoader');
const sectorLoader = require('./data_loader/sectorLoader');
const levelLoader = require('./data_loader/levelLoader');

const app = express();
const port = 3000;
const executableSchema = makeExecutableSchema({ typeDefs, resolvers });
const protectedSchema = applyMiddleware(executableSchema);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(bodyParser.json());

const server = new ApolloServer({
  schema: protectedSchema,
  context: ({ req }) => ({
    req,
    loaders: { specialityLoader, sectorLoader, levelLoader },
  }),
});

server.applyMiddleware({ app });

app.listen(port, async () => {
  console.log(await conn);
  console.log(`GraphQL server is running on http://localhost:${port}/graphql`);
});
