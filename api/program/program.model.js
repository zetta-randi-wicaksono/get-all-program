// *************** IMPORT CORE ***************
const mongoose = require('mongoose');

/**
 * Schema definition for Campus
 * @type {mongoose.Schema}
 */
const programSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    status: { type: String, enum: ['active', 'deleted'], default: 'active', required: true },
    program_publish_status: { type: String, enum: ['published', 'not_published'], default: 'not_published', required: true },
    speciality_id: { type: mongoose.Types.ObjectId, ref: 'Speciality' },
    sector_id: { type: mongoose.Types.ObjectId, ref: 'Sector' },
    level_id: { type: mongoose.Types.ObjectId, ref: 'Level' },
    campus_id: { type: mongoose.Types.ObjectId, ref: 'Campus' },
    school_id: { type: mongoose.Types.ObjectId, ref: 'School' },
    scholar_season_id: { type: mongoose.Types.ObjectId, ref: 'Scholar_season' },
  },
  {
    timestamps: true, // *************** Automatically adds createdAt and updatedAt fields.
  }
);

const Program = new mongoose.model('Program', programSchema);

// *************** EXPORT MODULE ***************
module.exports = Program;
