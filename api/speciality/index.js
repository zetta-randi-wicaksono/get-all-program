// *************** IMPORT MODULE ***************
const specialityModel = require('./speciality.model');
const specialityResolver = require('./speciality.resolver');
const specialityTypeDef = require('./speciality.typeDef');

const Speciality = {
  model: specialityModel,
  resolver: specialityResolver,
  typeDef: specialityTypeDef,
};

// *************** EXPORT MODULE ***************
module.exports = Speciality;
