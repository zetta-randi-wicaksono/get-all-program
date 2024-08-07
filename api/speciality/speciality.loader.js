const DataLoader = require('dataloader');
const Speciality = require('./speciality.model');

const batchSpecialities = async (specialityIds) => {
  const specialities = await Speciality.find({ _id: { $in: specialityIds } });
  return specialityIds.map((specialityId) => specialities.find((speciality) => speciality._id.toString() === specialityId.toString()));
};

const specialityLoader = new DataLoader(batchSpecialities);

module.exports = specialityLoader;
