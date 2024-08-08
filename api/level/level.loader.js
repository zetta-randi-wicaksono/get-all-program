// *************** IMPORT LIBRARY ***************
const DataLoader = require('dataloader');

// *************** IMPORT MODULE ***************
const Level = require('./level.model');

/**
 * Batch function to load levels by their ids.
 * @param {Array} levelIds - Array of level ids to load.
 * @returns {Object} - Array of level documents corresponding to the given ids.
 */
const batchLevels = async (levelIds) => {
  const levels = await Level.find({ _id: { $in: levelIds } }); // *************** Fetch all level that match the given ids
  return levelIds.map((levelId) => levels.find((level) => level._id.toString() === levelId.toString())); // *************** Map the ids to the corresponding level documents
};

// *************** Create a DataLoader instance for level data
const levelLoader = new DataLoader(batchLevels);

// *************** EXPORT MODULE ***************
module.exports = levelLoader;
