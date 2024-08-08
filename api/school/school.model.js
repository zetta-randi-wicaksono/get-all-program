// *************** IMPORT CORE ***************
const mongoose = require('mongoose');

/**
 * Schema definition for Campus
 * @type {mongoose.Schema}
 */
const schoolSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    status: { type: String, enum: ['active', 'deleted'], default: 'active', required: true },
  },
  {
    timestamps: true, // *************** Automatically adds createdAt and updatedAt fields.
  }
);

const School = new mongoose.model('School', schoolSchema);

// *************** EXPORT MODULE ***************
module.exports = School;
