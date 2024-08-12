// *************** IMPORT CORE ***************
const mongoose = require('mongoose');

// *************** IMPORT MODULE ***************
const Campus = require('./campus.model');
const Program = require('../program/program.model');

// *************** IMPORT HELPER FUNCTION ***************
const { CreateAggregateQueryForGetAllCampuses } = require('./campus.helper');

// *************** QUERY ***************
/**
 * Retrieves all campuses based on provided filters, sorting, and pagination.
 * @param {Object} args - The arguments provided by the query.
 * @param {Object} args.filter - The filter criteria.
 * @param {Object} args.sort - The sort criteria.
 * @param {Object} args.pagination - The pagination criteria.
 * @returns {Array} The list of campuses.
 */
async function GetAllCampuses(parent, args) {
  try {
    const { filter, sort, pagination } = args;

    // *************** Create aggregation query from arguments
    const aggregateQuery = CreateAggregateQueryForGetAllCampuses(filter, sort, pagination);
    const getAllCampusesResult = await Campus.aggregate(aggregateQuery);

    // *************** Check campuses collection length
    if (!getAllCampusesResult.length) {
      throw new Error('Campuses Data Not Found');
    }

    return getAllCampusesResult;
  } catch (error) {
    throw new Error(`An error occurred: ${error.message}`);
  }
}

/**
 * Retrieves one campus document based on _id.
 * @param {Object} args - The arguments provided by the query.
 * @param {string} args._id - The _id used to search for campus document.
 * @returns {Object} The campus document.
 */
async function GetOneCampus(parent, args) {
  try {
    const { _id } = args;
    // *************** Trim id input to removes whitespace from both sides of a string.
    const campusId = _id.trim();

    if (typeof campusId !== 'string' || campusId.length !== 24) {
      throw new Error(`Id ${campusId} is invalid. Id must be a string of 24 characters`);
    }

    const getOneCampusResult = await Campus.findById(campusId);

    // *************** Validation throw error when campus data is null or campus status is deleted
    if (!getOneCampusResult || getOneCampusResult.status === 'deleted') {
      throw new Error('Campus Data Not Found');
    }

    return getOneCampusResult;
  } catch (error) {
    throw new Error(`An error occurred: ${error.message}`);
  }
}

// *************** MUTATION ***************
/**
 * Create a new document in the campuses collection
 * @param {Object} args - The arguments provided by the query.
 * @param {Object} args.campus_input - The campus input data that will be entered into the document
 * @returns {Object} The campus document that have been created
 */
async function CreateCampus(parent, args) {
  try {
    const createCampusInput = { ...args.campus_input };
    // *************** Trim name input to removes whitespace from both sides of a string.
    const campusNameInput = createCampusInput.name.trim();

    if (typeof campusNameInput !== 'string') {
      throw new Error(`Name ${campusNameInput} is invalid. Name must be a string`);
    }

    if (campusNameInput === '') {
      throw new Error('Input name cannot be an empty string.');
    }

    // *************** Fetch campus data to validate the name input
    const campusNameCheck = await Campus.findOne({ name: campusNameInput, status: 'active' }).collation({ locale: 'en', strength: 2 });

    if (campusNameCheck) {
      throw new Error(`Campus Name '${campusNameInput}' Has Already Been Taken`);
    }

    createCampusInput.name = campusNameInput;
    const createCampusResult = await Campus.create(createCampusInput);
    return createCampusResult;
  } catch (error) {
    throw new Error(`An error occurred: ${error.message}`);
  }
}

/**
 * Update the campus document according to the _id.
 * @param {Object} args - The arguments provided by the query.
 * @param {string} args._id - The _id used to find for campus document.
 * @param {Object} args.campus_input - The campus input data that will be updated into the document.
 * @returns {Object} The campus document that have been updated.
 */
async function UpdateCampus(parent, args) {
  try {
    const { _id } = args;
    // *************** Trim id input to removes whitespace from both sides of a string.
    const campusId = _id.trim();

    if (typeof campusId !== 'string' || campusId.length !== 24) {
      throw new Error(`Id ${campusId} is invalid. Id must be a string of 24 characters`);
    }

    const campusDataCheck = await Campus.findById(campusId);

    // *************** Validation throw error when campus data is null or campus status is deleted
    if (!campusDataCheck || campusDataCheck.status === 'deleted') {
      throw new Error('Campus Data Not Found');
    }

    // *************** Validation throw error when campus data is connected to program collection
    const connectedToProgramCheck = await Program.findOne({ campus_id: mongoose.Types.ObjectId(campusId) });

    if (connectedToProgramCheck) {
      throw new Error(`Cannot Update. Campus '${campusDataCheck.name}' is Still Used in The Program '${connectedToProgramCheck.name}'`);
    }

    const updateCampusInput = { ...args.campus_input };

    // *************** Trim name input to removes whitespace from both sides of a string.
    const campusNameInput = updateCampusInput.name.trim();

    if (typeof campusNameInput !== 'string') {
      throw new Error(`Name ${campusNameInput} is invalid. Name must be a string`);
    }

    if (campusNameInput === '') {
      throw new Error('Input name cannot be an empty string.');
    }

    const campusNameCheck = await Campus.findOne({ name: campusNameInput, status: 'active' }).collation({ locale: 'en', strength: 2 });

    // *************** Validation throw error when campus name is already taken in another document
    if (campusNameCheck && campusNameCheck._id.toString() !== campusId) {
      throw new Error(`Campus Name '${campusNameInput}' Has Already Been Taken`);
    }

    updateCampusInput.name = campusNameInput;
    const updateCampusResult = await Campus.findByIdAndUpdate(campusId, updateCampusInput, { new: true, useFindAndModify: false });
    return updateCampusResult;
  } catch (error) {
    throw new Error(`An error occurred: ${error.message}`);
  }
}

/**
 * Delete the campus document according to the _id.
 * @param {Object} args - The arguments provided by the query.
 * @param {string} args._id - The _id used to find for campus document.
 * @returns {Object} The campus document that have been deleted.
 */
async function DeleteCampus(parent, args) {
  try {
    const { _id } = args;
    // *************** Trim id input to removes whitespace from both sides of a string.
    const campusId = _id.trim();

    if (typeof campusId !== 'string' || campusId.length !== 24) {
      throw new Error(`Id ${campusId} is invalid. Id must be a string of 24 characters`);
    }

    const campusDataCheck = await Campus.findById(campusId);

    // *************** Check campus document if it exists and the status is active then the document can be deleted.
    if (campusDataCheck && campusDataCheck.status === 'active') {
      const connectedToProgramCheck = await Program.findOne({ campus_id: mongoose.Types.ObjectId(campusId) });

      // *************** Validation throw error when campus data is connected to program collection
      if (!connectedToProgramCheck) {
        const deleteCampusResult = await Campus.findByIdAndUpdate(campusId, { status: 'deleted' }, { new: true, useFindAndModify: false });
        return deleteCampusResult;
      } else {
        throw new Error(`Cannot Delete. Campus '${campusDataCheck.name}' is Still Used in The Program '${connectedToProgramCheck.name}'`);
      }
    } else {
      throw new Error('Campus Data Not Found');
    }
  } catch (error) {
    throw new Error(`An error occurred: ${error.message}`);
  }
}

const resolvers = {
  Query: {
    GetAllCampuses,
    GetOneCampus,
  },

  Mutation: {
    CreateCampus,
    UpdateCampus,
    DeleteCampus,
  },
};

// *************** EXPORT MODULE ***************
module.exports = resolvers;
