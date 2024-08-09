// *************** IMPORT CORE ***************
const mongoose = require('mongoose');

// *************** IMPORT MODULE ***************
const Level = require('./level.model');
const Program = require('../program/program.model');

// *************** IMPORT HELPER FUNCTION ***************
const { createAggregateQueryForGetAllLevels } = require('./level.helper');

// *************** QUERY ***************
/**
 * Retrieves all levels based on provided filters, sorting, and pagination.
 * @param {Object} args - The arguments provided by the query.
 * @param {Object} args.filter - The filter criteria.
 * @param {Object} args.sort - The sort criteria.
 * @param {Object} args.pagination - The pagination criteria.
 * @returns {Array} The list of levels.
 */
async function GetAllLevels(parent, args) {
  try {
    const { filter, sort, pagination } = args;

    // *************** Create aggregation query from arguments
    const aggregateQuery = createAggregateQueryForGetAllLevels(filter, sort, pagination);
    const getAllLevelsResult = await Level.aggregate(aggregateQuery);

    // *************** Check levels collection length
    if (!getAllLevelsResult.length) {
      throw new Error('Levels Data Not Found');
    }

    return getAllLevelsResult;
  } catch (error) {
    throw new Error(`An error occurred: ${error.message}`);
  }
}

/**
 * Retrieves one level document based on _id.
 * @param {Object} args - The arguments provided by the query.
 * @param {string} args._id - The _id used to search for level document.
 * @returns {Object} The level document.
 */
async function GetOneLevel(parent, args) {
  try {
    const { _id } = args;
    // *************** Trim id input to removes whitespace from both sides of a string.
    const levelId = _id.trim();

    if (typeof levelId !== 'string' || levelId.length !== 24) {
      throw new Error(`Id ${levelId} is invalid. Id must be a string of 24 characters`);
    }

    const getOneLevelResult = await Level.findById(levelId);

    // *************** Validation throw error when level data is null or level status is deleted
    if (!getOneLevelResult || getOneLevelResult.status === 'deleted') {
      throw new Error('Level Data Not Found');
    }

    return getOneLevelResult;
  } catch (error) {
    throw new Error(`An error occurred: ${error.message}`);
  }
}

// *************** MUTATION ***************
/**
 * Create a new document in the levels collection.
 * @param {Object} args - The arguments provided by the query.
 * @param {Object} args.level_input - The level input data that will be entered into the document.
 * @returns {Object} The level document that have been created.
 */
async function CreateLevel(parent, args) {
  try {
    const createLevelInput = { ...args.level_input };
    // *************** Trim name input to removes whitespace from both sides of a string.
    const levelNameInput = createLevelInput.name.trim();

    if (typeof levelNameInput !== 'string') {
      throw new Error(`Name ${levelNameInput} is invalid. Name must be a string`);
    }

    if (levelNameInput === '') {
      throw new Error('Input name cannot be an empty string.');
    }

    // *************** Fetch level data to validate the name input
    const levelNameCheck = await Level.findOne({ name: levelNameInput, status: 'active' }).collation({ locale: 'en', strength: 2 });

    if (levelNameCheck) {
      throw new Error(`Level Name '${levelNameInput}' Has Already Been Taken`);
    }

    const createLevelResult = new Level(createLevelInput);
    await createLevelResult.save();
    return createLevelResult;
  } catch (error) {
    throw new Error(`An error occurred: ${error.message}`);
  }
}

/**
 * Update the level document according to the _id.
 * @param {Object} args - The arguments provided by the query.
 * @param {string} args._id - The _id used to find for level document.
 * @param {Object} args.level_input - The level input data that will be updated into the document.
 * @returns {Object} The level document that have been updated.
 */
async function UpdateLevel(parent, args) {
  try {
    const { _id } = args;
    // *************** Trim id input to removes whitespace from both sides of a string.
    const levelId = _id.trim();

    if (typeof levelId !== 'string' || levelId.length !== 24) {
      throw new Error(`Id ${levelId} is invalid. Id must be a string of 24 characters`);
    }

    const levelDataCheck = await Level.findById(levelId);

    // *************** Validation throw error when level data is null or level status is deleted
    if (!levelDataCheck || levelDataCheck.status === 'deleted') {
      throw new Error('Level Data Not Found');
    }

    // *************** Validation throw error when level data is connected to program collection
    const connectedToProgramCheck = await Program.findOne({ level_id: mongoose.Types.ObjectId(levelId) });

    if (connectedToProgramCheck) {
      throw new Error(`Cannot Update. Level '${levelDataCheck.name}' is Still Used in The Program '${connectedToProgramCheck.name}'`);
    }

    const updateLevelInput = { ...args.level_input };

    // *************** Trim name input to removes whitespace from both sides of a string.
    const levelNameInput = updateLevelInput.name.trim();

    if (typeof levelNameInput !== 'string') {
      throw new Error(`Name ${levelNameInput} is invalid. Name must be a string`);
    }

    if (levelNameInput === '') {
      throw new Error('Input name cannot be an empty string.');
    }

    const levelNameCheck = await Level.findOne({ name: levelNameInput, status: 'active' }).collation({ locale: 'en', strength: 2 });

    // *************** Validation throw error when level name is already taken in another document
    if (levelNameCheck && levelNameCheck._id.toString() !== levelId) {
      throw new Error(`Level Name '${levelNameInput}' Has Already Been Taken`);
    }

    updateLevelInput.name = levelNameInput;
    const updateLevelResult = await Level.findByIdAndUpdate(levelId, updateLevelInput, { new: true, useFindAndModify: false });
    return updateLevelResult;
  } catch (error) {
    throw new Error(`An error occurred: ${error.message}`);
  }
}

/**
 * Delete the level document according to the _id.
 * @param {Object} args - The arguments provided by the query.
 * @param {string} args._id - The _id used to find for level document.
 * @returns {Object} The level document that have been deleted.
 */
async function DeleteLevel(parent, args) {
  try {
    const { _id } = args;
    // *************** Trim id input to removes whitespace from both sides of a string.
    const levelId = _id.trim();

    if (typeof levelId !== 'string' || levelId.length !== 24) {
      throw new Error(`Id ${levelId} is invalid. Id must be a string of 24 characters`);
    }

    const levelDataCheck = await Level.findById(levelId);

    // *************** Check level document if it exists and the status is active then the document can be deleted.
    if (levelDataCheck && levelDataCheck.status === 'active') {
      const connectedToProgramCheck = await Program.findOne({ level_id: mongoose.Types.ObjectId(levelId) });

      // *************** Validation throw error when level data is connected to program collection
      if (!connectedToProgramCheck) {
        const deleteLevelResult = await Level.findByIdAndUpdate(levelId, { status: 'deleted' }, { new: true, useFindAndModify: false });
        return deleteLevelResult;
      } else {
        throw new Error(`Cannot Delete. Level '${levelDataCheck.name}' is Still Used in The Program '${connectedToProgramCheck.name}'`);
      }
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
