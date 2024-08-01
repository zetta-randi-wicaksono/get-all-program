const DataLoader = require('dataloader');
const Speciality = require('../models/speciality');

const batchSpecialities = async (specialityIds) => {
  const specialities = await Speciality.find({ _id: { $in: specialityIds } });
  return specialityIds.map((specialityId) => specialities.find((speciality) => speciality._id.toString() === specialityId.toString()));
};

module.exports = new DataLoader(batchSpecialities);
