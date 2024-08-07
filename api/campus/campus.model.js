// *************** IMPORT CORE ***************
const mongoose = require('mongoose');

/**
 * Schema definition for Campus
 * @type {mongoose.Schema}
 */
const campusSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, collation: { locale: 'en', strength: 2 } },
    status: { type: String, enum: ['active', 'deleted'], default: 'active', required: true },
  },
  {
    timestamps: true, // *************** Automatically adds createdAt and updatedAt fields.
  }
);

campusSchema.index({ name: 1 }, { unique: true, collation: { locale: 'en', strength: 2 } });

const Campus = new mongoose.model('Campus', campusSchema);

// *************** EXPORT MODULE ***************
module.exports = Campus;
