const mongoose = require('mongoose');

const campusSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    level_id: [{ type: mongoose.Types.ObjectId, ref: 'level' }],
    status: { type: String, enum: ['active', 'deleted'], default: 'active', required: true },
  },
  {
    timestamps: true,
  }
);

module.exports = new mongoose.model('Campus', campusSchema);
