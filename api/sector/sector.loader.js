const DataLoader = require('dataloader');
const Sector = require('./sector.model');

const batchSectors = async (sectorIds) => {
  const sectors = await Sector.find({ _id: { $in: sectorIds } });
  return sectorIds.map((sectorId) => sectors.find((sector) => sector._id.toString() === sectorId.toString()));
};

const sectorLoader = new DataLoader(batchSectors);

module.exports = sectorLoader;
