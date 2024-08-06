// *************** IMPORT MODULE ***************
const sectorModel = require('./sector.model');
const sectorResolver = require('./sector.resolver');
const sectorTypeDef = require('./sector.typeDef');

const Sector = {
  model: sectorModel,
  resolver: sectorResolver,
  typeDef: sectorTypeDef,
};

// *************** EXPORT MODULE ***************
module.exports = Sector;
