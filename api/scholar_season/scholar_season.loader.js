// *************** IMPORT LIBRARY ***************
const DataLoader = require('dataloader');

// *************** IMPORT MODULE ***************
const ScholarSeason = require('./scholar_season.model');

/**
 * Batch function to load scholar seasons by their ids.
 * @param {Array} scholarSeasonIds - Array of scholar season ids to load.
 * @returns {Object} - Array of scholar season documents corresponding to the given ids.
 */
const batchScholarSeasons = async (scholarSeasonIds) => {
  // *************** Fetch all scholar season that match the given ids
  const scholarSeasons = await ScholarSeason.find({ _id: { $in: scholarSeasonIds } });
  // *************** Map the ids to the corresponding scholar season documents
  const mappedScholarSeasons = scholarSeasonIds.map((scholarSeasonId) =>
    scholarSeasons.find((scholarSeason) => scholarSeason._id.toString() === scholarSeasonId.toString())
  );
  return mappedScholarSeasons;
};

// *************** Create a DataLoader instance for scholar season data
const scholarSeasonLoader = new DataLoader(batchScholarSeasons);

// *************** EXPORT MODULE ***************
module.exports = scholarSeasonLoader;
