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

    // *************** Map the ids to the corresponding Level documents
    const mappedLevels = new Map();
    levels.forEach((level) => mappedLevels.set(level._id.toString(), level));

    // *************** Create a Array to associate level IDs with the corresponding level documents
    const arrayOfLevels = [];
    levelIds.forEach((levelId) => arrayOfLevels.push(mappedLevels.get(levelId.toString())));
    return arrayOfLevels;
  } catch (error) {
    throw new Error(error.message);
  }
};

// *************** Create a DataLoader instance for level data
const levelLoader = new DataLoader(BatchLevels);

// *************** EXPORT MODULE ***************
module.exports = levelLoader;
