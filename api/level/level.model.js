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
    // *************** Automatically adds createdAt and updatedAt fields.
    timestamps: true,
  }
);

const Level = new mongoose.model('Level', levelSchema);

// *************** EXPORT MODULE ***************
module.exports = Level;
