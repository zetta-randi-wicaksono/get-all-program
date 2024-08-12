// *************** IMPORT LIBRARY ***************
const DataLoader = require('dataloader');

// *************** IMPORT MODULE ***************
const Speciality = require('./speciality.model');

/**
 * Batch function to load specialities by their ids.
 * @param {Array} specialityIds - Array of speciality ids to load.
 * @returns {Object} - Array of speciality documents corresponding to the given ids.
 */
const BatchSpecialities = async (specialityIds) => {
  try {
    // *************** Fetch all specialities that match the given ids
    const specialities = await Speciality.find({ _id: { $in: specialityIds } });

    // *************** Map the ids to the corresponding Specialities documents
    const mappedSpecialities = new Map();
    specialities.forEach((speciality) => mappedSpecialities.set(speciality._id.toString(), speciality));

    // *************** Create a Array to associate level IDs with the corresponding level documents
    const arrayOfSpecialities = [];
    specialityIds.forEach((specialityId) => arrayOfSpecialities.push(mappedSpecialities.get(specialityId.toString())));
    return arrayOfSpecialities;
  } catch (error) {
    throw new Error(error.message);
  }
};

// *************** Create a DataLoader instance for speciality data
const specialityLoader = new DataLoader(BatchSpecialities);

// *************** EXPORT MODULE ***************
module.exports = specialityLoader;
