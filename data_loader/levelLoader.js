const DataLoader = require('dataloader');
const Level = require('../models/level');

const batchLevel = async (levelIds) => {
  const levels = await Level.find({ _id: { $in: levelIds } });
  return levelIds.map((levelId) => levels.find((level) => level._id.toString() === levelId.toString()));
};

module.exports = new DataLoader(batchLevel);
