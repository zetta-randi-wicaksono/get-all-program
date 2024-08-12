// *************** IMPORT CORE ***************
const mongoose = require('mongoose');

// *************** IMPORT MODULE ***************
const School = require('./school.model');
const Program = require('../program/program.model');

// *************** IMPORT HELPER FUNCTION ***************
const { CreateAggregateQueryForGetAllSchools } = require('./school.helper');

// *************** QUERY ***************
/**
 * Retrieves all schools based on provided filters, sorting, and pagination.
 * @param {Object} args - The arguments provided by the query.
 * @param {Object} args.filter - The filter criteria.
 * @param {Object} args.sort - The sort criteria.
 * @param {Object} args.pagination - The pagination criteria.
 * @returns {Array} The list of schools.
 */
async function GetAllSchools(parent, args) {
  try {
    const { filter, sort, pagination } = args;

    // *************** Create aggregation query from arguments
    const aggregateQuery = CreateAggregateQueryForGetAllSchools(filter, sort, pagination);
    const getAllSchoolsResult = await School.aggregate(aggregateQuery);

    return getAllSchoolsResult;
  } catch (error) {
    throw new Error(`An error occurred: ${error.message}`);
  }
}

/**
 * Retrieves one school document based on _id.
 * @param {Object} args  - The arguments provided by the query.
 * @param {string} args._id - The _id used to search for school document.
 * @returns {Object} The school document.
 */
async function GetOneSchool(parent, args) {
  try {
    const { _id } = args;
    // *************** Trim id input to removes whitespace from both sides of a string.
    const schoolId = _id.trim();

    const schoolIdValidation = mongoose.Types.ObjectId.isValid(schoolId);
    if (!schoolIdValidation) {
      throw new Error(`Id ${schoolId} is invalid. Id must be a string of 24 characters`);
    }

    const getOneSchoolResult = await School.findById(schoolId);

    // *************** Validation throw error when school data is null or school status is deleted
    if (!getOneSchoolResult || getOneSchoolResult.status === 'deleted') {
      throw new Error('School Data Not Found');
    }

    return getOneSchoolResult;
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
 */
async function CreateSchool(parent, args) {
  try {
    const createSchoolInput = { ...args.school_input };
    // *************** Trim name input to removes whitespace from both sides of a string.
    const schoolNameInput = createSchoolInput.name.trim();

    if (typeof schoolNameInput !== 'string') {
      throw new Error(`Name ${schoolNameInput} is invalid. Name must be a string`);
    }

    if (schoolNameInput === '') {
      throw new Error('Input name cannot be an empty string.');
    }

    // *************** Fetch school data to validate the name input
    const schoolNameCheck = await School.findOne({ name: schoolNameInput, status: 'active' }).collation({ locale: 'en', strength: 2 });

    if (schoolNameCheck) {
      throw new Error(`School Name '${schoolNameInput}' Has Already Been Taken`);
    }

    createSchoolInput.name = schoolNameInput;
    const createSchoolResult = await School.create(createSchoolInput);
    return createSchoolResult;
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
 */
async function UpdateSchool(parent, args) {
  try {
    const { _id } = args;
    // *************** Trim id input to removes whitespace from both sides of a string.
    const schoolId = _id.trim();

    const schoolIdValidation = mongoose.Types.ObjectId.isValid(schoolId);
    if (!schoolIdValidation) {
      throw new Error(`Id ${schoolId} is invalid. Id must be a string of 24 characters`);
    }

    const schoolDataCheck = await School.findById(schoolId);

    // *************** Validation throw error when school data is null or school status is deleted
    if (!schoolDataCheck || schoolDataCheck.status === 'deleted') {
      throw new Error('School Data Not Found');
    }

    // *************** Validation throw error when school data is connected to program collection
    const connectedToProgramCheck = await Program.findOne({ school_id: mongoose.Types.ObjectId(schoolId) });

    if (connectedToProgramCheck) {
      throw new Error(`Cannot Update. School '${schoolDataCheck.name}' is Still Used in The Program '${connectedToProgramCheck.name}'`);
    }

    const updateSchoolInput = { ...args.school_input };

    // *************** Trim name input to removes whitespace from both sides of a string.
    const schoolNameInput = updateSchoolInput.name.trim();

    if (typeof schoolNameInput !== 'string') {
      throw new Error(`Name ${schoolNameInput} is invalid. Name must be a string`);
    }

    if (schoolNameInput === '') {
      throw new Error('Input name cannot be an empty string.');
    }

    const schoolNameCheck = await School.findOne({ name: schoolNameInput, status: 'active', _id: { $ne: schoolId } }).collation({
      locale: 'en',
      strength: 2,
    });

    // *************** Validation throw error when school name is already taken in another document
    if (schoolNameCheck) {
      throw new Error(`School Name '${schoolNameInput}' Has Already Been Taken`);
    }

    updateSchoolInput.name = schoolNameInput;
    const updateSchoolResult = await School.findByIdAndUpdate(schoolId, updateSchoolInput, { new: true, useFindAndModify: false });
    return updateSchoolResult;
  } catch (error) {
    throw new Error(`An error occurred: ${error.message}`);
  }
}

/**
 * Delete the school document according to the _id.
 * @param {Object} args - The arguments provided by the query.
 * @param {string} args._id - The _id used to find for school document.
 * @returns {Object} The school document that have been deleted.
 */
async function DeleteSchool(parent, args) {
  try {
    const { _id } = args;
    // *************** Trim id input to removes whitespace from both sides of a string.
    const schoolId = _id.trim();

    const schoolIdValidation = mongoose.Types.ObjectId.isValid(schoolId);
    if (!schoolIdValidation) {
      throw new Error(`Id ${schoolId} is invalid. Id must be a string of 24 characters`);
    }

    const schoolDataCheck = await School.findById(schoolId);

    // *************** Check school document if it exists and the status is active then the document can be deleted.
    if (schoolDataCheck && schoolDataCheck.status === 'active') {
      const connectedToProgramCheck = await Program.findOne({ school_id: mongoose.Types.ObjectId(schoolId) });

      // *************** Validation throw error when school data is connected to program collection
      if (!connectedToProgramCheck) {
        const deleteSchoolResult = await School.findByIdAndUpdate(schoolId, { status: 'deleted' }, { new: true, useFindAndModify: false });
        return deleteSchoolResult;
      } else {
        throw new Error(`Cannot Delete. School '${schoolDataCheck.name}' is Still Used in The Program '${connectedToProgramCheck.name}'`);
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
