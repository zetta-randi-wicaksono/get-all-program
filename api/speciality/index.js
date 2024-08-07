// *************** IMPORT MODULE ***************
const specialityModel = require('./speciality.model');
const specialityResolver = require('./speciality.resolver');
const specialityTypeDef = require('./speciality.typeDef');
const specialityLoader = require('./speciality.loader');

const Speciality = {
  model: specialityModel,
  resolver: specialityResolver,
  typeDef: specialityTypeDef,
  loader: specialityLoader,
};

// *************** EXPORT MODULE ***************
module.exports = Speciality;
