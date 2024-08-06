// *************** IMPORT MODULE ***************
const Campus = require('./campus.model');

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
 * @throws {Error} If no campus documents are found.
 */
async function GetAllCampuses(parent, args) {
  try {
    const { filter, sort, pagination } = args;
    const aggregateQuery = createAggregateQueryForGetAllCampuses(filter, sort, pagination); // *************** Create aggregation query from arguments
    const campus = await Campus.aggregate(aggregateQuery);

    // *************** Check sectors collection length
    if (!campus.length) {
      throw new Error('Campus Data Not Found');
    }

    return campus;
  } catch (error) {
    throw new Error(`An error occurred: ${error.message}`);
  }
}

/**
 * Retrieves one campus document based on _id.
 * @param {Object} args - The arguments provided by the query.
 * @param {string} args._id - The _id used to search for level document.
 * @returns {Object} The campus document.
 * @throws {Error} If no campus document are found.
 */
async function GetOneCampus(parent, args) {
  try {
    const campus = await Campus.findById(args._id);

    // *************** Validation throw error when level data is null or level status is deleted
    if (!campus || campus.status === 'deleted') {
      throw new Error('Campus Data Not Found');
    }

    return campus;
  } catch (error) {
    throw new Error(`An error occurred: ${error.message}`);
  }
}

// *************** MUTATION ***************
/**
 * Create a new document in the campuses collection
 * @param {Object} args - The arguments provided by the query.
 * @param {Object} args.speciality_input - The campus input data that will be entered into the document
 * @returns {Object} The campus document that have been created
 * @throws {Error} If no campus document are found.
 */
async function CreateCampus(parent, args) {
  try {
    const campus = new Campus({ ...args.campus_input });
    await campus.save();
    return campus;
  } catch (error) {
    throw new Error(`An error occurred: ${error.message}`);
  }
}

/**
 * Update the campus document according to the _id.
 * @param {Object} args - The arguments provided by the query.
 * @param {string} args._id - The _id used to find for campus document.
 * @param {Object} args.speciality_input - The campus input data that will be updated into the document.
 * @returns {Object} The campus document that have been updated.
 * @throws {Error} If no campus document are found.
 */
async function UpdateCampus(parent, args) {
  try {
    const checkCampusData = await Campus.findById(args._id);

    // *************** Validation throw error when level data is null or level status is deleted
    if (!checkCampusData || checkCampusData.status === 'deleted') {
      throw new Error('Campus Data Not Found');
    }

    const campus = await Campus.findByIdAndUpdate(args._id, { ...args.campus_input }, { new: true, useFindAndModify: false });
    return campus;
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
    const campusDataCheck = await Campus.findById(args._id);

    // *************** Check sector document if it exists and the status is active then the document can be deleted.
    if (campusDataCheck && campusDataCheck.status === 'active') {
      const campus = await Campus.findByIdAndUpdate(args._id, { status: 'deleted' }, { new: true, useFindAndModify: false });
      return campus;
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
