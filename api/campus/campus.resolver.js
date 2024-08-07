// *************** IMPORT CORE ***************
const mongoose = require('mongoose');

// *************** IMPORT MODULE ***************
const Campus = require('./campus.model');
const Program = require('../program/program.model');

// *************** IMPORT HELPER FUNCTION ***************
const { createAggregateQueryForGetAllCampuses } = require('./campus.helper');

// *************** QUERY ***************
/**
 * Retrieves all campuses based on provided filters, sorting, and pagination.
 * @param {Object} args - The arguments provided by the query.
 * @param {Object} args.filter - The filter criteria.
 * @param {Object} args.sort - The sort criteria.
 * @param {Object} args.pagination - The pagination criteria.
 * @returns {Array} The list of campuses.
 * @throws {Error} If no campuses are found.
 */
async function GetAllCampuses(parent, args) {
  try {
    const { filter, sort, pagination } = args;
    const aggregateQuery = createAggregateQueryForGetAllCampuses(filter, sort, pagination); // *************** Create aggregation query from arguments
    const campusesResult = await Campus.aggregate(aggregateQuery);

    // *************** Check campuses collection length
    if (!campusesResult.length) {
      throw new Error('Campuses Data Not Found');
    }

    return campusesResult;
  } catch (error) {
    throw new Error(`An error occurred: ${error.message}`);
  }
}

/**
 * Retrieves one campus document based on _id.
 * @param {Object} args - The arguments provided by the query.
 * @param {string} args._id - The _id used to search for campus document.
 * @returns {Object} The campus document.
 * @throws {Error} If no campus document are found.
 */
async function GetOneCampus(parent, args) {
  try {
    const { _id } = args;
    const campusResult = await Campus.findById(_id);

    // *************** Validation throw error when campus data is null or campus status is deleted
    if (!campusResult || campusResult.status === 'deleted') {
      throw new Error('Campus Data Not Found');
    }

    return campusResult;
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
 * @throws {Error} If the name is already in use or already in campuses collection.
 */
async function CreateCampus(parent, args) {
  try {
    const createCampusInput = { ...args.campus_input };

    const campusNameCheck = await Campus.findOne({ name: createCampusInput.name }).collation({ locale: 'en', strength: 2 });
    if (campusNameCheck) {
      throw new Error(`Name '${createCampusInput.name}' Has Already Been Taken`);
    }

    const campusResult = new Campus(createCampusInput);
    await campusResult.save();
    return campusResult;
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
 * @throws {Error} If no campus document are found.
 */
async function UpdateCampus(parent, args) {
  try {
    const { _id } = args;
    const campusDataCheck = await Campus.findById(_id);

    // *************** Validation throw error when campus data is null or campus status is deleted
    if (!campusDataCheck || campusDataCheck.status === 'deleted') {
      throw new Error('Campus Data Not Found');
    }

    const connectedToProgramCheck = await Program.find({ campus_id: mongoose.Types.ObjectId(_id) });
    if (connectedToProgramCheck.length) {
      throw new Error('Cannot Update. Campus Id is Still Used in The Program');
    }

    const updateCampusInput = { ...args.campus_input };

    if (updateCampusInput.name) {
      const campusNameCheck = await Campus.findOne({ name: updateCampusInput.name }).collation({ locale: 'en', strength: 2 });
      if (campusNameCheck) {
        throw new Error(`Name '${updateCampusInput.name}' Has Already Been Taken`);
      }
    }

    const campusResult = await Campus.findByIdAndUpdate(_id, updateCampusInput, { new: true, useFindAndModify: false });
    return campusResult;
  } catch (error) {
    throw new Error(`An error occurred: ${error.message}`);
  }
}

/**
 * Delete the campus document according to the _id.
 * @param {Object} args - The arguments provided by the query.
 * @param {string} args._id - The _id used to find for campus document.
 * @returns {Object} The campus document that have been deleted.
 * @throws {Error} If no campus document are found.
 */
async function DeleteCampus(parent, args) {
  try {
    const { _id } = args;
    const campusDataCheck = await Campus.findById(_id);

    // *************** Check campus document if it exists and the status is active then the document can be deleted.
    if (campusDataCheck && campusDataCheck.status === 'active') {
      const connectedToProgramCheck = await Program.find({ campus_id: mongoose.Types.ObjectId(_id) });
      if (!connectedToProgramCheck.length) {
        const campusResult = await Campus.findByIdAndUpdate(_id, { status: 'deleted' }, { new: true, useFindAndModify: false });
        return campusResult;
      } else {
        throw new Error('Cannot Delete. Campus Id is Still Used in The Program');
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
