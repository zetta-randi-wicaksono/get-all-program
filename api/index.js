// *************** IMPORT LIBRARY ***************
const { mergeTypeDefs } = require('@graphql-tools/merge');

// *************** IMPORT MODULE ***************
const speciality = require('./speciality');
const sector = require('./sector');
const level = require('./level');

const graphqlConfig = {
  resolvers: [speciality.resolver, sector.resolver, level.resolver],
  typeDefs: mergeTypeDefs([speciality.typeDef, sector.typeDef, level.typeDef]),
  context: {
    models: {
      speciality: speciality.model,
      sector: sector.model,
      level: level.model,
    },
  },
};

// *************** EXPORT MODULE ***************
module.exports = graphqlConfig;
