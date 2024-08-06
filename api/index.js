// *************** IMPORT LIBRARY ***************
const { mergeTypeDefs } = require('@graphql-tools/merge');

// *************** IMPORT MODULE ***************
const speciality = require('./speciality');
const sector = require('./sector');
const level = require('./level');
const campus = require('./campus');

const graphqlConfig = {
  resolvers: [speciality.resolver, sector.resolver, level.resolver, campus.resolver],
  typeDefs: mergeTypeDefs([speciality.typeDef, sector.typeDef, level.typeDef, campus.typeDef]),
  context: {
    models: {
      speciality: speciality.model,
      sector: sector.model,
      level: level.model,
      campus: campus.model,
    },
  },
};

// *************** EXPORT MODULE ***************
module.exports = graphqlConfig;
