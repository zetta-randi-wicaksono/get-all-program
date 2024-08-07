// *************** IMPORT MODULE ***************
const schoolModel = require('./school.model');
const schoolResolver = require('./school.resolver');
const schoolTypeDef = require('./school.typeDef');
const schoolLoader = require('./school.loader');

const School = {
  model: schoolModel,
  resolver: schoolResolver,
  typeDef: schoolTypeDef,
  loader: schoolLoader,
};

// *************** EXPORT MODULE ***************
module.exports = School;
