// *************** IMPORT CORE ***************
const mongoose = require('mongoose');

// *************** IMPORT MODULE ***************
const School = require('./school.model');
const Program = require('../program/program.model');

// *************** IMPORT HELPER FUNCTION ***************
const { createAggregateQueryForGetAllSchools } = require('./school.helper');

// *************** QUERY ***************
/**
 * Retrieves all schools based on provided filters, sorting, and pagination.
 * @param {Object} args - The arguments provided by the query.
 * @param {Object} args.filter - The filter criteria.
 * @param {Object} args.sort - The sort criteria.
 * @param {Object} args.pagination - The pagination criteria.
 * @returns {Array} The list of schools.
 * @throws {Error} If no schools are found.
 */
async function GetAllSchools(parent, args) {
  try {
    const { filter, sort, pagination } = args;
    const aggregateQuery = createAggregateQueryForGetAllSchools(filter, sort, pagination); // *************** Create aggregation query from arguments
    const schoolsResult = await School.aggregate(aggregateQuery);

    // *************** Check schools collection length
    if (!schoolsResult.length) {
      throw new Error('Schools Data is Empty');
    }

    return schoolsResult;
  } catch (error) {
    throw new Error(`An error occurred: ${error.message}`);
  }
}

/**
 * Retrieves one school document based on _id.
 * @param {Object} args  - The arguments provided by the query.
 * @param {string} args._id - The _id used to search for school document.
 * @returns {Object} The school document.
 * @throws {Error} If no school document are found.
 */
async function GetOneSchool(parent, args) {
  try {
    const { _id } = args;
    const schoolResult = await School.findById(_id);

    // *************** Validation throw error when school data is null or school status is deleted
    if (!schoolResult || schoolResult.status === 'deleted') {
      throw new Error('School Data Not Found');
    }

    return schoolResult;
  } catch (error) {
    throw new Error(`An error occurred: ${error.message}`);
  }
}

// *************** MUTATION ***************
/**
 * Create a new document in the schools collection
 * @param {Object} args - The arguments provided by the query.
 * @param {Object} args.school_input - The school input data that will be entered into the document
 * @returns {Object} The school document that have been created
 * @throws {Error} If the name is already in use or already in schools collection.
 */
async function CreateSchool(parent, args) {
  try {
    const createSchoolInput = { ...args.school_input };
    const schoolResult = new School(createSchoolInput);
    await schoolResult.save();
    return schoolResult;
  } catch (error) {
    throw new Error(`An error occurred: ${error.message}`);
  }
}

/**
 * Update the school document according to the _id.
 * @param {Object} args - The arguments provided by the query.
 * @param {string} args._id - The _id used to find for school document.
 * @param {Object} args.school_input - The school input data that will be updated into the document.
 * @returns {Object} The school document that have been updated.
 * @throws {Error} If no school document are found.
 */
async function UpdateSchool(parent, args) {
  try {
    const { _id } = args;
    const schoolDataCheck = await School.findById(_id);

    // *************** Validation throw error when school data is null or school status is deleted
    if (!schoolDataCheck || schoolDataCheck.status === 'deleted') {
      throw new Error('School Data Not Found');
    }

    const connectedToProgramCheck = await Program.find({ school_id: mongoose.Types.ObjectId(_id) });
    if (connectedToProgramCheck.length) {
      throw new Error('Cannot Update. School Id is Still Used in The Program');
    }

    const updateSchoolInput = { ...args.school_input };
    const schoolResult = await School.findByIdAndUpdate(_id, updateSchoolInput, { new: true, useFindAndModify: false });
    return schoolResult;
  } catch (error) {
    throw new Error(`An error occurred: ${error.message}`);
  }
}

/**
 * Delete the school document according to the _id.
 * @param {Object} args - The arguments provided by the query.
 * @param {string} args._id - The _id used to find for school document.
 * @returns {Object} The school document that have been deleted.
 * @throws {Error} If no school document are found.
 */
async function DeleteSchool(parent, args) {
  try {
    const { _id } = args;
    const schoolDataCheck = await School.findById(_id);

    // *************** Check school document if it exists and the status is active then the document can be deleted.
    if (schoolDataCheck && schoolDataCheck.status === 'active') {
      const connectedToProgramCheck = await Program.find({ school_id: mongoose.Types.ObjectId(_id) });
      if (!connectedToProgramCheck.length) {
        const schoolResult = await School.findByIdAndUpdate(_id, { status: 'deleted' }, { new: true, useFindAndModify: false });
        return schoolResult;
      } else {
        throw new Error('Cannot Delete. Sector Id is Still Used in The Program');
      }
    } else {
      throw new Error('School Data Not Found');
    }
  } catch (error) {
    throw new Error(`An error occurred: ${error.message}`);
  }
}

const resolvers = {
  Query: {
    GetAllSchools,
    GetOneSchool,
  },

  Mutation: {
    CreateSchool,
    UpdateSchool,
    DeleteSchool,
  },
};

// *************** EXPORT MODULE ***************
module.exports = resolvers;
