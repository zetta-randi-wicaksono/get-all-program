// *************** IMPORT CORE ***************
const mongoose = require('mongoose');

/**
 * Schema definition for Campus
 * @type {mongoose.Schema}
 */
const scholarSeasonSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, collation: { locale: 'en', strength: 2 } },
    status: { type: String, enum: ['active', 'deleted'], default: 'active', required: true },
  },
  {
    timestamps: true, // *************** Automatically adds createdAt and updatedAt fields.
  }
);

scholarSeasonSchema.index({ name: 1 }, { unique: true, collation: { locale: 'en', strength: 2 } });

const ScholarSeason = new mongoose.model('Scholar_season', scholarSeasonSchema);

// *************** EXPORT MODULE ***************
module.exports = ScholarSeason;
