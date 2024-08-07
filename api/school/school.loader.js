const DataLoader = require('dataloader');
const School = require('./school.model');

const batchSchools = async (schoolIds) => {
  const schools = await School.find({ _id: { $in: schoolIds } });
  return schoolIds.map((schoolId) => schools.find((school) => school._id.toString() === schoolId.toString()));
};

const schoolLoader = new DataLoader(batchSchools);

module.exports = schoolLoader;
