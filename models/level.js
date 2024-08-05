const mongoose = require('mongoose');

const levelSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    sector_id: [{ type: mongoose.Types.ObjectId, ref: 'sector' }],
    status: { type: String, enum: ['active', 'deleted'], default: 'active', required: true },
  },
  {
    timestamps: true,
  }
);

module.exports = new mongoose.model('Level', levelSchema);
