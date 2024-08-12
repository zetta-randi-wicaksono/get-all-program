// *************** IMPORT LIBRARY ***************
const DataLoader = require('dataloader');

// *************** IMPORT MODULE ***************
const Campus = require('./campus.model');

/**
 * Batch function to load campuses by their ids.
 * @param {Array} campusIds - Array of campus ids to load.
 * @returns {Object} - Array of campus documents corresponding to the given ids.
 */
const BatchCampuses = async (campusIds) => {
  try {
    // *************** Fetch all campus that match the given ids
    const campuses = await Campus.find({ _id: { $in: campusIds } });

    // *************** Map the ids to the corresponding Campus documents
    const mappedCampuses = new Map();
    campuses.forEach((campus) => mappedCampuses.set(campus._id.toString(), campus));

    // *************** Create a Array to associate level IDs with the corresponding level documents
    const arrayOfCampuses = [];
    campusIds.forEach((campusId) => arrayOfCampuses.push(mappedCampuses.get(campusId.toString())));
    return arrayOfCampuses;
  } catch (error) {
    throw new Error(error.message);
  }
};

// *************** Create a DataLoader instance for campus data
const campusLoader = new DataLoader(BatchCampuses);

// *************** EXPORT MODULE ***************
module.exports = campusLoader;
