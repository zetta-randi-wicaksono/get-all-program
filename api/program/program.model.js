// *************** IMPORT CORE ***************
const mongoose = require('mongoose');

/**
 * Schema definition for Campus
 * @type {mongoose.Schema}
 */
const programSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, collation: { locale: 'en', strength: 2 } },
    status: { type: String, enum: ['active', 'deleted'], default: 'active', required: true },
    program_publish_status: { type: String, enum: ['published', 'not_published'], default: 'not_published', required: true },
    speciality_id: { type: mongoose.Types.ObjectId, ref: 'specialities' },
    sector_id: { type: mongoose.Types.ObjectId, ref: 'sectors' },
    level_id: { type: mongoose.Types.ObjectId, ref: 'levels' },
    campus_id: { type: mongoose.Types.ObjectId, ref: 'campuses' },
    school_id: { type: mongoose.Types.ObjectId, ref: 'schools' },
    scholar_season_id: { type: mongoose.Types.ObjectId, ref: 'scholar_seasons' },
  },
  {
    timestamps: true, // *************** Automatically adds createdAt and updatedAt fields.
  }
);

programSchema.index({ name: 1 }, { unique: true, collation: { locale: 'en', strength: 2 } });

const Program = new mongoose.model('Program', programSchema);

// *************** EXPORT MODULE ***************
module.exports = Program;
