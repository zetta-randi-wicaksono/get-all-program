// *************** IMPORT LIBRARY ***************
const mongoose = require('mongoose');

/**
 * Schema definition for Level
 * @type {mongoose.Schema}
 */
const levelSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    status: { type: String, enum: ['active', 'deleted'], default: 'active', required: true },
  },
  {
    timestamps: true, // *************** Automatically adds createdAt and updatedAt fields.
  }
);

// *************** EXPORT MODULE ***************
module.exports = new mongoose.model('Level', levelSchema);
