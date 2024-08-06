// *************** IMPORT MODULE ***************
const schoolModel = require('./school.model');
const schoolResolver = require('./school.resolver');
const schoolTypeDef = require('./school.typeDef');

const School = {
  model: schoolModel,
  resolver: schoolResolver,
  typeDef: schoolTypeDef,
};

// *************** EXPORT MODULE ***************
module.exports = School;
