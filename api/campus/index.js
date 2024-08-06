// *************** IMPORT MODULE ***************
const campusModel = require('./campus.model');
const campusResolver = require('./campus.resolver');
const campusTypeDef = require('./campus.typeDef');

const Campus = {
  model: campusModel,
  resolver: campusResolver,
  typeDef: campusTypeDef,
};

// *************** EXPORT MODULE ***************
module.exports = Campus;
