// *************** IMPORT LIBRARY ***************
const { mergeTypeDefs } = require('@graphql-tools/merge');

// *************** IMPORT MODULE ***************
const speciality = require('./speciality');
const sector = require('./sector');
const level = require('./level');
const campus = require('./campus');
const school = require('./school');
const scholarSeason = require('./scholar_season');

const graphqlConfig = {
  resolvers: [speciality.resolver, sector.resolver, level.resolver, campus.resolver, school.resolver, scholarSeason.resolver],
  typeDefs: mergeTypeDefs([speciality.typeDef, sector.typeDef, level.typeDef, campus.typeDef, school.typeDef, scholarSeason.typeDef]),
  context: {
    models: {
      speciality: speciality.model,
      sector: sector.model,
      level: level.model,
      campus: campus.model,
      school: school.model,
      scholarSeason: scholarSeason.model,
    },
  },
};

// *************** EXPORT MODULE ***************
module.exports = graphqlConfig;
