// *************** IMPORT MODULE ***************
const Level = require('./level.model');

// *************** IMPORT HELPER FUNCTION ***************
const { createAggregateQueryForGetAllLevels } = require('./level.helper');

// *************** QUERY ***************
/**
 * Retrieves all specialities based on provided filters, sorting, and pagination.
 * @param {Object} args - The arguments provided by the query.
 * @param {Object} args.filter - The filter criteria.
 * @param {Object} args.sort - The sort criteria.
 * @param {Object} args.pagination - The pagination criteria.
 * @returns {Array} The list of levels.
 * @throws {Error} If no level documents are found.
 */
async function GetAllLevels(parent, args) {
  try {
    const { filter, sort, pagination } = args;
    const aggregateQuery = createAggregateQueryForGetAllLevels(filter, sort, pagination); // *************** Create aggregation query from arguments
    const level = await Level.aggregate(aggregateQuery);

    // *************** Check sectors collection length
    if (!level.length) {
      throw new Error('Level Data Not Found');
    }

    return level;
  } catch (error) {
    throw new Error(`An error occurred: ${error.message}`);
  }
}

/**
 * Retrieves one level document based on _id.
 * @param {Object} args - The arguments provided by the query.
 * @param {string} args._id - The _id used to search for level document.
 * @returns {Object} The sector document.
 * @throws {Error} If no sector document are found.
 */
async function GetOneLevel(parent, args) {
  try {
    const level = await Level.findById(args._id);

    // *************** Validation throw error when level data is null or level status is deleted
    if (!level || level.status === 'deleted') {
      throw new Error('Level Data Not Found');
    }

    return level;
  } catch (error) {
    throw new Error(`An error occurred: ${error.message}`);
  }
}

// *************** MUTATION ***************
/**
 * Create a new document in the level collection
 * @param {Object} args - The arguments provided by the query.
 * @param {Object} args.speciality_input - The level input data that will be entered into the document
 * @returns {Object} The level document that have been created
 * @throws {Error} If no level document are found.
 */
async function CreateLevel(parent, args) {
  try {
    const level = new Level({ ...args.level_input });
    await level.save();
    return level;
  } catch (error) {
    throw new Error(`An error occurred: ${error.message}`);
  }
}

/**
 * Update the level document according to the _id.
 * @param {Object} args - The arguments provided by the query.
 * @param {string} args._id - The _id used to find for level document.
 * @param {Object} args.speciality_input - The level input data that will be updated into the document.
 * @returns {Object} The level document that have been updated.
 * @throws {Error} If no level document are found.
 */
async function UpdateLevel(parent, args) {
  try {
    const checkLevelData = await Level.findById(args._id);

    // *************** Validation throw error when level data is null or level status is deleted
    if (!checkLevelData || checkLevelData.status === 'deleted') {
      throw new Error('Level Data Not Found');
    }

    const level = await Level.findByIdAndUpdate(args._id, { ...args.level_input }, { new: true, useFindAndModify: false });
    return level;
  } catch (error) {
    throw new Error(`An error occurred: ${error.message}`);
  }
}

/**
 * Delete the level document according to the _id.
 * @param {Object} args - The arguments provided by the query.
 * @param {string} args._id - The _id used to find for level document.
 * @returns {Object} The level document that have been deleted.
 * @throws {Error} If no level document are found.
 */
async function DeleteLevel(parent, args) {
  try {
    const levelDataCheck = await Level.findById({ _id: args._id });

    // *************** Check sector document if it exists and the status is active then the document can be deleted.
    if (levelDataCheck && levelDataCheck.status === 'active') {
      const level = await Level.findByIdAndUpdate(args._id, { status: 'deleted' }, { new: true, useFindAndModify: false });
      return level;
    } else {
      throw new Error('Level Data Not Found');
    }
  } catch (error) {
    throw new Error(`An error occurred: ${error.message}`);
  }
}

const resolvers = {
  Query: {
    GetAllLevels,
    GetOneLevel,
  },

  Mutation: {
    CreateLevel,
    UpdateLevel,
    DeleteLevel,
  },
};

// *************** EXPORT MODULE ***************
module.exports = resolvers;
