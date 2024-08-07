const DataLoader = require('dataloader');
const Level = require('./level.model');

const batchLevels = async (levelIds) => {
  const levels = await Level.find({ _id: { $in: levelIds } });
  return levelIds.map((levelId) => levels.find((level) => level._id.toString() === levelId.toString()));
};

const levelLoader = new DataLoader(batchLevels);

module.exports = levelLoader;
