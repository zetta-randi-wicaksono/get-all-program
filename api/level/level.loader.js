// *************** IMPORT LIBRARY ***************
const DataLoader = require('dataloader');

// *************** IMPORT MODULE ***************
const Level = require('./level.model');

/**
 * Batch function to load levels by their ids.
 * @param {Array} levelIds - Array of level ids to load.
 * @returns {Object} - Array of level documents corresponding to the given ids.
 */
const BatchLevels = async (levelIds) => {
  try {
    // *************** Fetch all level that match the given ids
    const levels = await Level.find({ _id: { $in: levelIds } });

    // *************** Map the ids to the corresponding level documents
    const mappedLevels = new Map();
    levelIds.forEach((levelId) =>
      mappedLevels.set(
        levelId,
        levels.find((level) => level._id.toString() === levelId.toString())
      )
    );

    const arrayOfLevels = [];
    levelIds.forEach((levelId) => arrayOfLevels.push(mappedLevels.get(levelId)));
    return arrayOfLevels;
  } catch (error) {
    throw new Error(error.message);
  }
};

// *************** Create a DataLoader instance for level data
const levelLoader = new DataLoader(BatchLevels);

// *************** EXPORT MODULE ***************
module.exports = levelLoader;
