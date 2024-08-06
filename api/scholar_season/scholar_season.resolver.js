// *************** IMPORT MODULE ***************
const ScholarSeason = require('./scholar_season.model');

// *************** QUERY ***************
/**
 * Retrieves all scholar seasons from collection.
 * @returns {Array} The list of scholar seasons.
 * @throws {Error} If no scholar seasons are found.
 */
async function GetAllScholarSeasons(parent, args) {
  try {
    const scholarSeasonsResult = await ScholarSeason.find().sort({ createdAt: -1 });

    // *************** Check schools collection length
    if (!scholarSeasonsResult.length) {
      throw new Error('Schools Data is Empty');
    }

    return scholarSeasonsResult;
  } catch (error) {
    throw new Error(`An error occurred: ${error.message}`);
  }
}

const resolvers = {
  Query: {
    GetAllScholarSeasons,
  },
};

// *************** EXPORT MODULE ***************
module.exports = resolvers;
