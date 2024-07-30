const mongoose = require('mongoose');

const sectorSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  speciality_ids: [{ type: mongoose.Types.ObjectId, ref: 'speciality' }],
  created_at: { type: Date },
  updated_at: { type: Date, default: null },
});

module.exports = new mongoose.model('Sector', sectorSchema);
