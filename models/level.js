const mongoose = require('mongoose');

const levelSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  sector_id: [{ type: mongoose.Types.ObjectId, ref: 'sector' }],
  created_at: { type: Date },
  updated_at: { type: Date, default: null },
});

module.exports = new mongoose.model('Level', levelSchema);
