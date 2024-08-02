const mongoose = require('mongoose');

const schoolSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    campus_id: [{ type: mongoose.Types.ObjectId, ref: 'campus' }],
  },
  {
    timestamps: true,
  }
);

module.exports = new mongoose.model('School', schoolSchema);
