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

const resolvers = {
  Query: {
    GetAllPrograms,
  },
};

// *************** EXPORT MODULE ***************
module.exports = resolvers;
