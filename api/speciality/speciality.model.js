// *************** IMPORT CORE ***************
const mongoose = require('mongoose');

/**
 * Schema definition for Speciality
 * @type {mongoose.Schema}
 */
const specialitySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    status: { type: String, enum: ['active', 'deleted'], default: 'active', required: true },
  },
  {
    // *************** Automatically adds createdAt and updatedAt fields.
    timestamps: true,
  }
);

const Speciality = new mongoose.model('Speciality', specialitySchema);

// *************** EXPORT MODULE ***************
module.exports = Speciality;
