const DataLoader = require('dataloader');
const Campus = require('./campus.model');

const batchCampuses = async (campusIds) => {
  const campuses = await Campus.find({ _id: { $in: campusIds } });
  return campusIds.map((campusId) => campuses.find((campus) => campus._id.toString() === campusId.toString()));
};

const campusLoader = new DataLoader(batchCampuses);

module.exports = campusLoader;
