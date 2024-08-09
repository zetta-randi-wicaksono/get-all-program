// *************** IMPORT CORE ***************
const mongoose = require('mongoose');

/**
 * Schema definition for Campus
 * @type {mongoose.Schema}
 */
const campusSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    status: { type: String, enum: ['active', 'deleted'], default: 'active', required: true },
  },
  {
    // *************** Automatically adds createdAt and updatedAt fields.
    timestamps: true,
  }
);

const Campus = new mongoose.model('Campus', campusSchema);

// *************** EXPORT MODULE ***************
module.exports = Campus;
