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
 * @throws {Error} If no levels are found.
 */
async function GetAllLevels(parent, args) {
  try {
    const { filter, sort, pagination } = args;
    const aggregateQuery = createAggregateQueryForGetAllLevels(filter, sort, pagination); // *************** Create aggregation query from arguments
    const levelsResult = await Level.aggregate(aggregateQuery);

    // *************** Check levels collection length
    if (!levelsResult.length) {
      throw new Error('Levels Data Not Found');
    }

    return levelsResult;
  } catch (error) {
    throw new Error(`An error occurred: ${error.message}`);
  }
}

/**
 * Retrieves one level document based on _id.
 * @param {Object} args - The arguments provided by the query.
 * @param {string} args._id - The _id used to search for level document.
 * @returns {Object} The level document.
 * @throws {Error} If no level document are found.
 */
async function GetOneLevel(parent, args) {
  try {
    const { _id } = args;
    const levelResult = await Level.findById(_id);

    // *************** Validation throw error when level data is null or level status is deleted
    if (!levelResult || levelResult.status === 'deleted') {
      throw new Error('Level Data Not Found');
    }

    return levelResult;
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
 * @throws {Error} If the name is already in use or already in levels collection.
 */
async function CreateLevel(parent, args) {
  try {
    const createLevelInput = { ...args.level_input };

    const levelNameCheck = await Level.findOne({ name: createLevelInput.name, status: 'active' }).collation({ locale: 'en', strength: 2 });
    if (levelNameCheck) {
      throw new Error(`Name '${createLevelInput.name}' Has Already Been Taken`);
    }

    const levelResult = new Level(createLevelInput);
    await levelResult.save();
    return levelResult;
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
 * @throws {Error} If no level document are found.
 */
async function UpdateLevel(parent, args) {
  try {
    const { _id } = args;
    const levelDataCheck = await Level.findById(_id);

    // *************** Validation throw error when level data is null or level status is deleted
    if (!levelDataCheck || levelDataCheck.status === 'deleted') {
      throw new Error('Level Data Not Found');
    }

    const connectedToProgramCheck = await Program.find({ level_id: mongoose.Types.ObjectId(_id) });
    if (connectedToProgramCheck.length) {
      throw new Error('Cannot Update. Level Id is Still Used in The Program');
    }

    const updateLevelInput = { ...args.level_input };

    if (updateLevelInput.name) {
      const levelNameCheck = await Level.findOne({ name: updateLevelInput.name, status: 'active' }).collation({
        locale: 'en',
        strength: 2,
      });
      if (levelNameCheck && levelNameCheck._id.toString() !== _id) {
        throw new Error(`Name '${updateLevelInput.name}' Has Already Been Taken`);
      }
    }

    const levelResult = await Level.findByIdAndUpdate(_id, updateLevelInput, { new: true, useFindAndModify: false });
    return levelResult;
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
    const { _id } = args;
    const levelDataCheck = await Level.findById(_id);

    // *************** Check level document if it exists and the status is active then the document can be deleted.
    if (levelDataCheck && levelDataCheck.status === 'active') {
      const connectedToProgramCheck = await Program.find({ level_id: mongoose.Types.ObjectId(_id) });
      if (!connectedToProgramCheck.length) {
        const levelResult = await Level.findByIdAndUpdate(_id, { status: 'deleted' }, { new: true, useFindAndModify: false });
        return levelResult;
      } else {
        throw new Error('Cannot Delete. Level Id is Still Used in The Program');
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
