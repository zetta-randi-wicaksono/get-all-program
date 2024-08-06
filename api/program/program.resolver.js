// *************** IMPORT MODULE ***************
const Program = require('./program.model');

// *************** QUERY ***************
/**
 * Retrieves all programs from collection.
 * @returns {Array} The list of scholar seasons.
 * @throws {Error} If no programs are found.
 */
async function GetAllPrograms(parent, args) {
  try {
    const programsResult = await Program.find({}).sort({ createdAt: -1 });

    // *************** Check scholar seasons collection length
    if (!programsResult.length) {
      throw new Error('Program Data is Empty');
    }

    return programsResult;
  } catch (error) {
    throw new Error(`An error occurred: ${error.message}`);
  }
}

/**
 * Retrieves one program document based on _id.
 * @param {Object} args  - The arguments provided by the query.
 * @param {string} args._id - The _id used to search for program document.
 * @returns {Object} The program document.
 * @throws {Error} If no program document are found.
 */
async function GetOneProgram(parent, args) {
  try {
    const { _id } = args;
    const programResult = await Program.findById(_id);

    // *************** Validation throw error when program data is null or program status is deleted
    if (!programResult || programResult.status === 'deleted') {
      throw new Error('Program Data Not Found');
    }

    return programResult;
  } catch (error) {
    throw new Error(`An error occurred: ${error.message}`);
  }
}

const resolvers = {
  Query: {
    GetAllPrograms,
    GetOneProgram,
  },
};

// *************** EXPORT MODULE ***************
module.exports = resolvers;
