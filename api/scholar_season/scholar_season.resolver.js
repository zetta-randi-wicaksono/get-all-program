// *************** IMPORT CORE ***************
const mongoose = require('mongoose');

// *************** IMPORT MODULE ***************
const ScholarSeason = require('./scholar_season.model');
const Program = require('../program/program.model');

// *************** IMPORT HELPER FUNCTION ***************
const { createAggregateQueryForGetAllScholarSeasons } = require('./scholar_season.helper');

// *************** QUERY ***************
/**
 * Retrieves all scholar seasons based on provided filters, sorting, and pagination.
 * @param {Object} args - The arguments provided by the query.
 * @param {Object} args.filter - The filter criteria.
 * @param {Object} args.sort - The sort criteria.
 * @param {Object} args.pagination - The pagination criteria.
 * @returns {Array} The list of scholar seasons.
 * @throws {Error} If no scholar seasons are found.
 */
async function GetAllScholarSeasons(parent, args) {
  try {
    const { filter, sort, pagination } = args;
    const aggregateQuery = createAggregateQueryForGetAllScholarSeasons(filter, sort, pagination); // *************** Create aggregation query from arguments
    const getAllScholarSeasonsResult = await ScholarSeason.aggregate(aggregateQuery);

    // *************** Check scholar seasons collection length
    if (!getAllScholarSeasonsResult.length) {
      throw new Error('Scholar Season Data is Empty');
    }

    return getAllScholarSeasonsResult;
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
    const getOneScholarSeasonsResult = await ScholarSeason.findById(_id);

    // *************** Validation throw error when scholar season data is null or scholar season status is deleted
    if (!getOneScholarSeasonsResult || getOneScholarSeasonsResult.status === 'deleted') {
      throw new Error('Scholar Season Data Not Found');
    }

    return getOneScholarSeasonsResult;
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

    // *************** Fetch scholar season data to validate the name input
    const scholarSeasonNameCheck = await ScholarSeason.findOne({ name: createScholarSeasonInput.name, status: 'active' }).collation({
      locale: 'en',
      strength: 2,
    });
    if (scholarSeasonNameCheck) {
      throw new Error(`Scholar Season Name '${createScholarSeasonInput.name}' Has Already Been Taken`);
    }

    const createScholarSeasonResult = new ScholarSeason(createScholarSeasonInput);
    await createScholarSeasonResult.save();
    return createScholarSeasonResult;
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

    // *************** Validation throw error when scholar season data is null or scholar season status is deleted
    if (!scholarSeasonDataCheck || scholarSeasonDataCheck.status === 'deleted') {
      throw new Error('Scholar Season Data Not Found');
    }

    // *************** Validation throw error when scholar season data is connected to program collection
    const connectedToProgramCheck = await Program.findOne({ scholar_season_id: mongoose.Types.ObjectId(_id) });
    if (connectedToProgramCheck) {
      throw new Error(`Cannot Update. Scholar Season is Still Used in The Program '${connectedToProgramCheck.name}'`);
    }

    const updateScholarSeasonInput = { ...args.scholar_season_input };

    // *************** Validation throw error when scholar season name is already taken in another document
    if (updateScholarSeasonInput.name) {
      const scholarSeasonNameCheck = await ScholarSeason.findOne({ name: updateScholarSeasonInput.name, status: 'active' }).collation({
        locale: 'en',
        strength: 2,
      });
      if (scholarSeasonNameCheck && scholarSeasonNameCheck._id.toString() !== _id) {
        throw new Error(`Scholar Season Name '${updateScholarSeasonInput.name}' Has Already Been Taken`);
      }
    }

    const updateScholarSeasonResult = await ScholarSeason.findByIdAndUpdate(_id, updateScholarSeasonInput, {
      new: true,
      useFindAndModify: false,
    });
    return updateScholarSeasonResult;
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
      const connectedToProgramCheck = await Program.findOne({ scholar_season_id: mongoose.Types.ObjectId(_id) });

      // *************** Validation throw error when scholar season data is connected to program collection
      if (!connectedToProgramCheck) {
        const deleteScholarSeasonResult = await ScholarSeason.findByIdAndUpdate(
          _id,
          { status: 'deleted' },
          { new: true, useFindAndModify: false }
        );
        return deleteScholarSeasonResult;
      } else {
        throw new Error(`Cannot Delete. Scholar Season is Still Used in The Program '${connectedToProgramCheck.name}'`);
      }
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
