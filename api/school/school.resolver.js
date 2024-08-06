// *************** IMPORT MODULE ***************
const School = require('./school.model');

// *************** QUERY ***************
/**
 * Retrieves all schools from collection.
 * @returns {Array} The list of campuses.
 * @throws {Error} If no campuses are found.
 */
async function GetAllSchools(parent, args) {
  try {
    const schoolsResult = await School.find({}).sort({ createdAt: -1 });
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
    if (!schoolResult) {
      throw new Error('School Data Not Found');
    }
    return schoolResult;
  } catch (error) {
    throw new Error(`An error occurred: ${error.message}`);
  }
}

const resolvers = {
  Query: {
    GetAllSchools,
    GetOneSchool,
  },
};

// *************** EXPORT MODULE ***************
module.exports = resolvers;
