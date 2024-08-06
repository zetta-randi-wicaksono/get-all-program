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

/**
 * Update the scholar season document according to the _id.
 * @param {Object} args - The arguments provided by the query.
 * @param {string} args._id - The _id used to find for scholar season document.
 * @param {Object} args.scholar_season_input - The scholar season input data that will be updated into the document.
 * @returns {Object} The scholar season document that have been updated.
 * @throws {Error} If no scholar season document are found.
 */
async function UpdateScholarSeason(parent, args) {
  try {
    const { _id } = args;
    const scholarSeasonDataCheck = await ScholarSeason.findById(_id);

    // *************** Validation throw error when school data is null or school status is deleted
    if (!scholarSeasonDataCheck || scholarSeasonDataCheck.status === 'deleted') {
      throw new Error('Scholar Season Data Not Found');
    }

    const updateScholarSeasonInput = { ...args.scholar_season_input };
    const scholarSeasonResult = await ScholarSeason.findByIdAndUpdate(_id, updateScholarSeasonInput, {
      new: true,
      useFindAndModify: false,
    });
    return scholarSeasonResult;
  } catch (error) {
    throw new Error(`An error occurred: ${error.message}`);
  }
}

/**
 * Delete the scholar season document according to the _id.
 * @param {Object} args - The arguments provided by the query.
 * @param {string} args._id - The _id used to find for scholar season document.
 * @returns {Object} The scholar season document that have been deleted.
 * @throws {Error} If no scholar season document are found.
 */
async function DeleteScholarSeason(parent, args) {
  try {
    const { _id } = args;
    const scholarSeasonDataCheck = await ScholarSeason.findById(_id);

    // *************** Check scholar season document if it exists and the status is active then the document can be deleted.
    if (scholarSeasonDataCheck && scholarSeasonDataCheck.status === 'active') {
      const scholarSeasonResult = await ScholarSeason.findByIdAndUpdate(_id, { status: 'deleted' }, { new: true, useFindAndModify: false });
      return scholarSeasonResult;
    } else {
      throw new Error('Scholar Season Data Not Found');
    }
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
    UpdateScholarSeason,
    DeleteScholarSeason,
  },
};

// *************** EXPORT MODULE ***************
module.exports = resolvers;
