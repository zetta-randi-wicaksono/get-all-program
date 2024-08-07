// *************** IMPORT CORE ***************
const mongoose = require('mongoose');

/**
 * Schema definition for Sector
 * @type {mongoose.Schema}
 */
const sectorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, collation: { locale: 'en', strength: 2 } },
    status: { type: String, enum: ['active', 'deleted'], default: 'active', required: true },
  },
  {
    timestamps: true, // *************** Automatically adds createdAt and updatedAt fields.
  }
);

sectorSchema.index({ name: 1 }, { unique: true, collation: { locale: 'en', strength: 2 } });

const Sector = new mongoose.model('Sector', sectorSchema);

// *************** EXPORT MODULE ***************
module.exports = Sector;
