// *************** IMPORT CORE ***************
const mongoose = require('mongoose');

// *************** IMPORT MODULE ***************
const ScholarSeason = require('./scholar_season.model');
const Program = require('../program/program.model');

// *************** IMPORT HELPER FUNCTION ***************
const { CreateAggregateQueryForGetAllScholarSeasons } = require('./scholar_season.helper');

// *************** QUERY ***************
/**
 * Retrieves all scholar seasons based on provided filters, sorting, and pagination.
 * @param {Object} args - The arguments provided by the query.
 * @param {Object} args.filter - The filter criteria.
 * @param {Object} args.sort - The sort criteria.
 * @param {Object} args.pagination - The pagination criteria.
 * @returns {Array} The list of scholar seasons.
 */
async function GetAllScholarSeasons(parent, args) {
  try {
    const { filter, sort, pagination } = args;

    // *************** Create aggregation query from arguments
    const aggregateQuery = CreateAggregateQueryForGetAllScholarSeasons(filter, sort, pagination);
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
 */
async function GetOneScholarSeason(parent, args) {
  try {
    const { _id } = args;
    // *************** Trim id input to removes whitespace from both sides of a string.
    const scholarSeasonId = _id.trim();

    if (typeof scholarSeasonId !== 'string' || scholarSeasonId.length !== 24) {
      throw new Error(`Id ${scholarSeasonId} is invalid. Id must be a string of 24 characters`);
    }

    const getOneScholarSeasonsResult = await ScholarSeason.findById(scholarSeasonId);

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
 */
async function CreateScholarSeason(parent, args) {
  try {
    const createScholarSeasonInput = { ...args.scholar_season_input };
    // *************** Trim name input to removes whitespace from both sides of a string.
    const scholarSeasonNameInput = createScholarSeasonInput.name.trim();

    if (typeof scholarSeasonNameInput !== 'string') {
      throw new Error(`Name ${scholarSeasonNameInput} is invalid. Name must be a string`);
    }

    if (scholarSeasonNameInput === '') {
      throw new Error('Input name cannot be an empty string.');
    }

    // *************** Fetch scholar season data to validate the name input
    const scholarSeasonNameCheck = await ScholarSeason.findOne({ name: scholarSeasonNameInput, status: 'active' }).collation({
      locale: 'en',
      strength: 2,
    });

    if (scholarSeasonNameCheck) {
      throw new Error(`Scholar Season Name '${scholarSeasonNameInput}' Has Already Been Taken`);
    }

    createScholarSeasonInput.name = scholarSeasonNameInput;
    const createScholarSeasonResult = await ScholarSeason.create(createScholarSeasonInput);
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
 */
async function UpdateScholarSeason(parent, args) {
  try {
    const { _id } = args;
    // *************** Trim id input to removes whitespace from both sides of a string.
    const scholarSeasonId = _id.trim();

    if (typeof scholarSeasonId !== 'string' || scholarSeasonId.length !== 24) {
      throw new Error(`Id ${scholarSeasonId} is invalid. Id must be a string of 24 characters`);
    }

    const scholarSeasonDataCheck = await ScholarSeason.findById(scholarSeasonId);

    // *************** Validation throw error when scholar season data is null or scholar season status is deleted
    if (!scholarSeasonDataCheck || scholarSeasonDataCheck.status === 'deleted') {
      throw new Error('Scholar Season Data Not Found');
    }

    // *************** Validation throw error when scholar season data is connected to program collection
    const connectedToProgramCheck = await Program.findOne({ scholar_season_id: mongoose.Types.ObjectId(scholarSeasonId) });

    if (connectedToProgramCheck) {
      throw new Error(
        `Cannot Update. Scholar Season '${scholarSeasonDataCheck.name}' is Still Used in The Program '${connectedToProgramCheck.name}'`
      );
    }

    const updateScholarSeasonInput = { ...args.scholar_season_input };

    // *************** Trim name input to removes whitespace from both sides of a string.
    const scholarSeasonNameInput = updateScholarSeasonInput.name.trim();

    if (typeof scholarSeasonNameInput !== 'string') {
      throw new Error(`Name ${scholarSeasonNameInput} is invalid. Name must be a string`);
    }

    if (scholarSeasonNameInput === '') {
      throw new Error('Input name cannot be an empty string.');
    }

    const scholarSeasonNameCheck = await ScholarSeason.findOne({
      name: scholarSeasonNameInput,
      status: 'active',
      _id: { $ne: scholarSeasonId },
    }).collation({
      locale: 'en',
      strength: 2,
    });

    // *************** Validation throw error when scholar season name is already taken in another document
    if (scholarSeasonNameCheck) {
      throw new Error(`Scholar Season Name '${scholarSeasonNameInput}' Has Already Been Taken`);
    }

    updateScholarSeasonInput.name = scholarSeasonNameInput;
    const updateScholarSeasonResult = await ScholarSeason.findByIdAndUpdate(scholarSeasonId, updateScholarSeasonInput, {
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
 */
async function DeleteScholarSeason(parent, args) {
  try {
    const { _id } = args;
    // *************** Trim id input to removes whitespace from both sides of a string.
    const scholarSeasonId = _id.trim();

    if (typeof scholarSeasonId !== 'string' || scholarSeasonId.length !== 24) {
      throw new Error(`Id ${scholarSeasonId} is invalid. Id must be a string of 24 characters`);
    }

    const scholarSeasonDataCheck = await ScholarSeason.findById(scholarSeasonId);

    // *************** Check scholar season document if it exists and the status is active then the document can be deleted.
    if (scholarSeasonDataCheck && scholarSeasonDataCheck.status === 'active') {
      const connectedToProgramCheck = await Program.findOne({ scholar_season_id: mongoose.Types.ObjectId(scholarSeasonId) });

      // *************** Validation throw error when scholar season data is connected to program collection
      if (!connectedToProgramCheck) {
        const deleteScholarSeasonResult = await ScholarSeason.findByIdAndUpdate(
          scholarSeasonId,
          { status: 'deleted' },
          { new: true, useFindAndModify: false }
        );
        return deleteScholarSeasonResult;
      } else {
        throw new Error(
          `Cannot Delete. Scholar Season '${scholarSeasonDataCheck.name}' is Still Used in The Program '${connectedToProgramCheck.name}'`
        );
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
