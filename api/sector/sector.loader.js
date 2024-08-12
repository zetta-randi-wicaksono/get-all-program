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

    // *************** Map the ids to the corresponding Sector documents
    const mappedSectors = new Map();
    sectors.forEach((sector) => mappedSectors.set(sector._id.toString(), sector));

    // *************** Create a Array to associate level IDs with the corresponding level documents
    const arrayOfSectors = [];
    sectorIds.forEach((sectorId) => arrayOfSectors.push(mappedSectors.get(sectorId.toString())));
    return arrayOfSectors;
  } catch (error) {
    throw new Error(error.message);
  }
};

// *************** Create a DataLoader instance for sector data
const sectorLoader = new DataLoader(BatchSectors);

// *************** EXPORT MODULE ***************
module.exports = sectorLoader;
