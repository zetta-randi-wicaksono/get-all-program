// *************** IMPORT LIBRARY ***************
const DataLoader = require('dataloader');

// *************** IMPORT MODULE ***************
const School = require('./school.model');

/**
 * Batch function to load schools by their ids.
 * @param {Array} schoolIds - Array of school ids to load.
 * @returns {Object} - Array of school documents corresponding to the given ids.
 */
const batchSchools = async (schoolIds) => {
  try {
    // *************** Fetch all schools that match the given ids
    const schools = await School.find({ _id: { $in: schoolIds } });
    // *************** Map the ids to the corresponding school documents
    const mappedSchools = schoolIds.map((schoolId) => schools.find((school) => school._id.toString() === schoolId.toString()));
    return mappedSchools;
  } catch (error) {
    throw new Error(error.message);
  }
};

// *************** Create a DataLoader instance for school data
const schoolLoader = new DataLoader(batchSchools);

// *************** EXPORT MODULE ***************
module.exports = schoolLoader;
