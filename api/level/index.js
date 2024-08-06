// *************** IMPORT MODULE ***************
const levelModel = require('./level.model');
const levelResolver = require('./level.resolver');
const levelTypeDef = require('./level.typeDef');

const Level = {
  model: levelModel,
  resolver: levelResolver,
  typeDef: levelTypeDef,
};

// *************** EXPORT MODULE ***************
module.exports = Level;
