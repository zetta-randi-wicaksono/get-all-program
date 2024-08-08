// *************** IMPORT LIBRARY ***************
const DataLoader = require('dataloader');

// *************** IMPORT MODULE ***************
const Sector = require('./sector.model');

/**
 * Batch function to load sectors by their ids.
 * @param {Array} sectorIds - Array of sector ids to load.
 * @returns {Object} - Array of sector documents corresponding to the given ids.
 */
const batchSectors = async (sectorIds) => {
  const sectors = await Sector.find({ _id: { $in: sectorIds } }); // *************** Fetch all sectors that match the given ids
  return sectorIds.map((sectorId) => sectors.find((sector) => sector._id.toString() === sectorId.toString())); // *************** Map the ids to the corresponding sector documents
};

// *************** Create a DataLoader instance for sector data
const sectorLoader = new DataLoader(batchSectors);

// *************** EXPORT MODULE ***************
module.exports = sectorLoader;
