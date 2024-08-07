// *************** IMPORT MODULE ***************
const scholarSeasonModel = require('./scholar_season.model');
const scholarSeasonResolver = require('./scholar_season.resolver');
const scholarSeasonTypeDef = require('./scholar_season.typeDef');
const scholarSeasonLoader = require('./scholar_season.loader');

const ScholarSeason = {
  model: scholarSeasonModel,
  resolver: scholarSeasonResolver,
  typeDef: scholarSeasonTypeDef,
  loader: scholarSeasonLoader,
};

// *************** EXPORT MODULE ***************
module.exports = ScholarSeason;
