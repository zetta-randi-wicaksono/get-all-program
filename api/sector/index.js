// *************** IMPORT MODULE ***************
const sectorModel = require('./sector.model');
const sectorResolver = require('./sector.resolver');
const sectorTypeDef = require('./sector.typeDef');
const sectorLoader = require('./sector.loader');

const Sector = {
  model: sectorModel,
  resolver: sectorResolver,
  typeDef: sectorTypeDef,
  loader: sectorLoader,
};

// *************** EXPORT MODULE ***************
module.exports = Sector;
