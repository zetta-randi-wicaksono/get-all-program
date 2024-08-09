// *************** IMPORT CORE ***************
const mongoose = require('mongoose');

/**
 * Schema definition for Campus
 * @type {mongoose.Schema}
 */
const scholarSeasonSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    status: { type: String, enum: ['active', 'deleted'], default: 'active', required: true },
  },
  {
    // *************** Automatically adds createdAt and updatedAt fields.
    timestamps: true,
  }
);

const ScholarSeason = new mongoose.model('Scholar_season', scholarSeasonSchema);

// *************** EXPORT MODULE ***************
module.exports = ScholarSeason;
