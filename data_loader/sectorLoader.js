const DataLoader = require('dataloader');
const Sector = require('../models/sector');

const batchSector = async (sectorIds) => {
  const sectors = await Sector.find({ _id: { $in: sectorIds } });
  return sectorIds.map((sectorId) => sectors.find((sector) => sector._id.toString() === sectorId.toString()));
};

module.exports = new DataLoader(batchSector);
