const mongoose = require('mongoose');

const specialitySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    status: { type: String, enum: ['active', 'deleted'], default: 'active', required: true },
  },
  {
    timestamps: true,
  }
);

module.exports = new mongoose.model('Speciality', specialitySchema);
