// *************** IMPORT CORE ***************
const mongoose = require('mongoose');

/**
 * Schema definition for Sector
 * @type {mongoose.Schema}
 */
const sectorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    status: { type: String, enum: ['active', 'deleted'], default: 'active', required: true },
  },
  {
    timestamps: true, // *************** Automatically adds createdAt and updatedAt fields.
  }
);

const Sector = new mongoose.model('Sector', sectorSchema);

// *************** EXPORT MODULE ***************
module.exports = Sector;
