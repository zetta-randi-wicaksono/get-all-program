const mongoose = require('mongoose');

const specialitySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  created_at: { type: Date },
  updated_at: { type: Date, default: null },
});

module.exports = new mongoose.model('Speciality', specialitySchema);
