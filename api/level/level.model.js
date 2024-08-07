// *************** IMPORT CORE ***************
const mongoose = require('mongoose');

/**
 * Schema definition for Level
 * @type {mongoose.Schema}
 */
const levelSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, collation: { locale: 'en', strength: 2 } },
    status: { type: String, enum: ['active', 'deleted'], default: 'active', required: true },
  },
  {
    timestamps: true, // *************** Automatically adds createdAt and updatedAt fields.
  }
);

levelSchema.index({ name: 1 }, { unique: true, collation: { locale: 'en', strength: 2 } });

const Level = new mongoose.model('Level', levelSchema);

// *************** EXPORT MODULE ***************
module.exports = Level;
