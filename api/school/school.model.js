// *************** IMPORT CORE ***************
const mongoose = require('mongoose');

/**
 * Schema definition for Campus
 * @type {mongoose.Schema}
 */
const schoolSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, collation: { locale: 'en', strength: 2 } },
    status: { type: String, enum: ['active', 'deleted'], default: 'active', required: true },
  },
  {
    timestamps: true, // *************** Automatically adds createdAt and updatedAt fields.
  }
);

schoolSchema.index({ name: 1 }, { unique: true, collation: { locale: 'en', strength: 2 } });

const School = new mongoose.model('School', schoolSchema);

// *************** EXPORT MODULE ***************
module.exports = School;
