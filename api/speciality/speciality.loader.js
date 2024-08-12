// *************** IMPORT LIBRARY ***************
const DataLoader = require('dataloader');

// *************** IMPORT MODULE ***************
const Speciality = require('./speciality.model');

/**
 * Batch function to load specialities by their ids.
 * @param {Array} specialityIds - Array of speciality ids to load.
 * @returns {Object} - Array of speciality documents corresponding to the given ids.
 */
const batchSpecialities = async (specialityIds) => {
  try {
    // *************** Fetch all specialities that match the given ids
    const specialities = await Speciality.find({ _id: { $in: specialityIds } });
    // *************** Map the ids to the corresponding speciality documents
    const mappedSpecialities = specialityIds.map((specialityId) =>
      specialities.find((speciality) => speciality._id.toString() === specialityId.toString())
    );
    return mappedSpecialities;
  } catch (error) {
    throw new Error(error.message);
  }
};

// *************** Create a DataLoader instance for speciality data
const specialityLoader = new DataLoader(batchSpecialities);

// *************** EXPORT MODULE ***************
module.exports = specialityLoader;
