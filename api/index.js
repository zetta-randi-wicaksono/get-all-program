// *************** IMPORT LIBRARY ***************
const { mergeTypeDefs } = require('@graphql-tools/merge');

// *************** IMPORT MODULE ***************
const speciality = require('./speciality');
const sector = require('./sector');

const graphqlConfig = {
  resolvers: [speciality.resolver, sector.resolver],
  typeDefs: mergeTypeDefs([speciality.typeDef, sector.typeDef]),
  context: {
    models: {
      speciality: speciality.model,
      sector: sector.model,
    },
  },
};

// *************** EXPORT MODULE ***************
module.exports = graphqlConfig;
