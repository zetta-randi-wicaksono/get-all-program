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

/**
 * Retrieves one scholar season document based on _id.
 * @param {Object} args  - The arguments provided by the query.
 * @param {string} args._id - The _id used to search for scholar season document.
 * @returns {Object} The scholar season document.
 * @throws {Error} If no scholar season document are found.
 */
async function GetOneScholarSeason(parent, args) {
  try {
    const { _id } = args;
    const scholarSeasonsResult = await ScholarSeason.findById(_id);

    // *************** Validation throw error when scholar season data is null or scholar season status is deleted
    if (!scholarSeasonsResult || scholarSeasonsResult.status === 'deleted') {
      throw new Error('Scholar Season Data Not Found');
    }

    return scholarSeasonsResult;
  } catch (error) {
    throw new Error(`An error occurred: ${error.message}`);
  }
}

// *************** MUTATION ***************
/**
 * Create a new document in the scholar seasons collection
 * @param {Object} args - The arguments provided by the query.
 * @param {Object} args.scholar_season_input - The scholar season input data that will be entered into the document
 * @returns {Object} The scholar season document that have been created
 * @throws {Error} If the name is already in use or already in scholar seasons collection.
 */
async function CreateScholarSeason(parent, args) {
  try {
    const createScholarSeasonInput = { ...args.scholar_season_input };
    const scholarSeasonResult = new ScholarSeason(createScholarSeasonInput);
    await scholarSeasonResult.save();
    return scholarSeasonResult;
  } catch (error) {
    throw new Error(`An error occurred: ${error.message}`);
  }
}

const resolvers = {
  Query: {
    GetAllScholarSeasons,
    GetOneScholarSeason,
  },

  Mutation: {
    CreateScholarSeason,
  },
};

// *************** EXPORT MODULE ***************
module.exports = resolvers;
