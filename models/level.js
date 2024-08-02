const mongoose = require('mongoose');

const levelSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    sector_id: [{ type: mongoose.Types.ObjectId, ref: 'sector' }],
  },
  {
    timestamps: true,
  }
);

module.exports = new mongoose.model('Level', levelSchema);
