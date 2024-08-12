// *************** IMPORT LIBRARY ***************
const DataLoader = require('dataloader');

// *************** IMPORT MODULE ***************
const Sector = require('./sector.model');

/**
 * Batch function to load sectors by their ids.
 * @param {Array} sectorIds - Array of sector ids to load.
 * @returns {Object} - Array of sector documents corresponding to the given ids.
 */
const BatchSectors = async (sectorIds) => {
  try {
    // *************** Fetch all sectors that match the given ids
    const sectors = await Sector.find({ _id: { $in: sectorIds } });
    // *************** Map the ids to the corresponding sector documents
    const mappedSectors = sectorIds.map((sectorId) => sectors.find((sector) => sector._id.toString() === sectorId.toString()));
    return mappedSectors;
  } catch (error) {
    throw new Error(error.message);
  }
};

// *************** Create a DataLoader instance for sector data
const sectorLoader = new DataLoader(BatchSectors);

// *************** EXPORT MODULE ***************
module.exports = sectorLoader;
