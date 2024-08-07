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
    const scholarSeasonsResult = await ScholarSeason.aggregate(aggregateQuery);

    // *************** Check scholar seasons collection length
    if (!scholarSeasonsResult.length) {
      throw new Error('Scholar Season Data is Empty');
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

    // *************** Validation throw error when scholar season data is null or scholar season status is deleted
    if (!scholarSeasonDataCheck || scholarSeasonDataCheck.status === 'deleted') {
      throw new Error('Scholar Season Data Not Found');
    }

    const connectedToProgramCheck = await Program.find({ scholar_season_id: mongoose.Types.ObjectId(_id) });
    if (connectedToProgramCheck.length) {
      throw new Error('Cannot Update. Scholar Season Id is Still Used in The Program');
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
      const connectedToProgramCheck = await Program.find({ scholar_season_id: mongoose.Types.ObjectId(_id) });
      if (!connectedToProgramCheck.length) {
        const scholarSeasonResult = await ScholarSeason.findByIdAndUpdate(
          _id,
          { status: 'deleted' },
          { new: true, useFindAndModify: false }
        );
        return scholarSeasonResult;
      } else {
        throw new Error('Cannot Delete. Scholar Season Id is Still Used in The Program');
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
