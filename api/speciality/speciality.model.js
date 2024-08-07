// *************** IMPORT CORE ***************
const mongoose = require('mongoose');

/**
 * Schema definition for Speciality
 * @type {mongoose.Schema}
 */
const specialitySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, collation: { locale: 'en', strength: 2 } },
    status: { type: String, enum: ['active', 'deleted'], default: 'active', required: true },
  },
  {
    timestamps: true, // *************** Automatically adds createdAt and updatedAt fields.
  }
);

specialitySchema.index({ name: 1 }, { unique: true, collation: { locale: 'en', strength: 2 } });

const Speciality = new mongoose.model('Speciality', specialitySchema);

// *************** EXPORT MODULE ***************
module.exports = Speciality;
