// *************** IMPORT LIBRARY ***************
const DataLoader = require('dataloader');

// *************** IMPORT MODULE ***************
const School = require('./school.model');

/**
 * Batch function to load schools by their ids.
 * @param {Array} schoolIds - Array of school ids to load.
 * @returns {Object} - Array of school documents corresponding to the given ids.
 */
const BatchSchools = async (schoolIds) => {
  try {
    // *************** Fetch all schools that match the given ids
    const schools = await School.find({ _id: { $in: schoolIds } });

    // *************** Map the ids to the corresponding School documents
    const mappedSchools = new Map();
    schools.forEach((school) => mappedSchools.set(school._id.toString(), school));

    // *************** Create a Array to associate level IDs with the corresponding level documents
    const arrayOfSchools = [];
    schoolIds.forEach((schoolId) => arrayOfSchools.push(mappedSchools.get(schoolId.toString())));
    return arrayOfSchools;
  } catch (error) {
    throw new Error(error.message);
  }
};

// *************** Create a DataLoader instance for school data
const schoolLoader = new DataLoader(BatchSchools);

// *************** EXPORT MODULE ***************
module.exports = schoolLoader;
