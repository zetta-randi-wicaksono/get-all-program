// *************** IMPORT LIBRARY ***************
const DataLoader = require('dataloader');

// *************** IMPORT MODULE ***************
const ScholarSeason = require('./scholar_season.model');

/**
 * Batch function to load scholar seasons by their ids.
 * @param {Array} scholarSeasonIds - Array of scholar season ids to load.
 * @returns {Object} - Array of scholar season documents corresponding to the given ids.
 */
const BatchScholarSeasons = async (scholarSeasonIds) => {
  try {
    // *************** Fetch all scholar season that match the given ids
    const scholarSeasons = await ScholarSeason.find({ _id: { $in: scholarSeasonIds } });

    // *************** Map the ids to the corresponding Scholar Season documents
    const mappedScholarSeasons = new Map();
    scholarSeasons.forEach((scholarSeason) => mappedScholarSeasons.set(scholarSeason._id.toString(), scholarSeason));

    // *************** Create a Array to associate level IDs with the corresponding level documents
    const arrayOfScholarSeason = [];
    scholarSeasonIds.forEach((scholarSeasonId) => arrayOfScholarSeason.push(mappedScholarSeasons.get(scholarSeasonId.toString())));
    return arrayOfScholarSeason;
  } catch (error) {
    throw new Error(error.message);
  }
};

// *************** Create a DataLoader instance for scholar season data
const scholarSeasonLoader = new DataLoader(BatchScholarSeasons);

// *************** EXPORT MODULE ***************
module.exports = scholarSeasonLoader;
