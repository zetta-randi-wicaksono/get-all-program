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
 * @throws {Error} If no campus document are found.
 */
async function GetOneCampus(parent, args) {
  try {
    const { _id } = args;
    const getOneCampusResult = await Campus.findById(_id);

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
 * @throws {Error} If the name is already in use or already in campuses collection.
 */
async function CreateCampus(parent, args) {
  try {
    const createCampusInput = { ...args.campus_input };

    // *************** Fetch campus data to validate the name input
    const campusNameCheck = await Campus.findOne({ name: createCampusInput.name, status: 'active' }).collation({
      locale: 'en',
      strength: 2,
    });
    if (campusNameCheck) {
      throw new Error(`Campus Name '${createCampusInput.name}' Has Already Been Taken`);
    }

    const createCampusResult = new Campus(createCampusInput);
    await createCampusResult.save();
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

    // *************** Validation throw error when campus data is connected to program collection
    const connectedToProgramCheck = await Program.findOne({ campus_id: mongoose.Types.ObjectId(_id) });
    if (connectedToProgramCheck) {
      throw new Error(`Cannot Update. Campus is Still Used in The Program '${connectedToProgramCheck.name}'`);
    }

    const updateCampusInput = { ...args.campus_input };

    // *************** Validation throw error when campus name is already taken in another document
    if (updateCampusInput.name) {
      const campusNameCheck = await Campus.findOne({ name: updateCampusInput.name, status: 'active' }).collation({
        locale: 'en',
        strength: 2,
      });
      if (campusNameCheck && campusNameCheck._id.toString() !== _id) {
        throw new Error(`Campus Name '${updateCampusInput.name}' Has Already Been Taken`);
      }
    }

    const updateCampusResult = await Campus.findByIdAndUpdate(_id, updateCampusInput, { new: true, useFindAndModify: false });
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
 * @throws {Error} If no campus document are found.
 */
async function DeleteCampus(parent, args) {
  try {
    const { _id } = args;
    const campusDataCheck = await Campus.findById(_id);

    // *************** Check campus document if it exists and the status is active then the document can be deleted.
    if (campusDataCheck && campusDataCheck.status === 'active') {
      const connectedToProgramCheck = await Program.findOne({ campus_id: mongoose.Types.ObjectId(_id) });

      // *************** Validation throw error when campus data is connected to program collection
      if (!connectedToProgramCheck) {
        const deleteCampusResult = await Campus.findByIdAndUpdate(_id, { status: 'deleted' }, { new: true, useFindAndModify: false });
        return deleteCampusResult;
      } else {
        throw new Error(`Cannot Delete. Campus is Still Used in The Program '${connectedToProgramCheck.name}'`);
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
