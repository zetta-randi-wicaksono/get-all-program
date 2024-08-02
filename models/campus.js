const mongoose = require('mongoose');

const campusSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    level_id: [{ type: mongoose.Types.ObjectId, ref: 'level' }],
  },
  {
    timestamps: true,
  }
);

module.exports = new mongoose.model('Campus', campusSchema);
