// *************** IMPORT MODULE ***************
const scholarSeasonModel = require('./scholar_season.model');
const scholarSeasonResolver = require('./scholar_season.resolver');
const scholarSeasonTypeDef = require('./scholar_season.typeDef');

const ScholarSeason = {
  model: scholarSeasonModel,
  resolver: scholarSeasonResolver,
  typeDef: scholarSeasonTypeDef,
};

// *************** EXPORT MODULE ***************
module.exports = ScholarSeason;
