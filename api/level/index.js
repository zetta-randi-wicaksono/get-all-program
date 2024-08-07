// *************** IMPORT MODULE ***************
const levelModel = require('./level.model');
const levelResolver = require('./level.resolver');
const levelTypeDef = require('./level.typeDef');
const levelLoader = require('./level.loader');

const Level = {
  model: levelModel,
  resolver: levelResolver,
  typeDef: levelTypeDef,
  loader: levelLoader,
};

// *************** EXPORT MODULE ***************
module.exports = Level;
