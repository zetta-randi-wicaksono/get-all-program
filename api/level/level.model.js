// *************** IMPORT CORE ***************
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

const Level = new mongoose.model('Level', levelSchema);

// *************** EXPORT MODULE ***************
module.exports = Level;
