const mongoose = require('mongoose');

const sectorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    speciality_id: [{ type: mongoose.Types.ObjectId, ref: 'speciality' }],
    status: { type: String, enum: ['active', 'deleted'], default: 'active', required: true },
  },
  {
    timestamps: true,
  }
);

module.exports = new mongoose.model('Sector', sectorSchema);
