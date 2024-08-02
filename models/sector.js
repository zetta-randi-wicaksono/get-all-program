const mongoose = require('mongoose');

const sectorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    speciality_id: [{ type: mongoose.Types.ObjectId, ref: 'speciality' }],
  },
  {
    timestamps: true,
  }
);

module.exports = new mongoose.model('Sector', sectorSchema);
