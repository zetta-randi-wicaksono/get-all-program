// *************** IMPORT MODULE ***************
const campusModel = require('./campus.model');
const campusResolver = require('./campus.resolver');
const campusTypeDef = require('./campus.typeDef');
const campusLoader = require('./campus.loader');

const Campus = {
  model: campusModel,
  resolver: campusResolver,
  typeDef: campusTypeDef,
  loader: campusLoader,
};

// *************** EXPORT MODULE ***************
module.exports = Campus;
