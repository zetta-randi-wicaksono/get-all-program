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

    // *************** Map the ids to the corresponding campus documents
    const mappedCampuses = new Map();
    campusIds.forEach((campusId) =>
      mappedCampuses.set(
        campusId,
        campuses.find((campus) => campus._id.toString() === campusId.toString())
      )
    );

    const arrayOfCampuses = [];
    campusIds.forEach((campusId) => arrayOfCampuses.push(mappedCampuses.get(campusId)));
    return arrayOfCampuses;
  } catch (error) {
    throw new Error(error.message);
  }
};

// *************** Create a DataLoader instance for campus data
const campusLoader = new DataLoader(BatchCampuses);

// *************** EXPORT MODULE ***************
module.exports = campusLoader;
