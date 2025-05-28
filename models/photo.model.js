// src/models/photo.model.js
const mongoose = require('mongoose');

const photoSchema = new mongoose.Schema({
  title: String,
  description: String,
  path: { type: String, required: true },
  isTrashed: { type: Boolean, default: false },
  isFavorite: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('Photo', photoSchema);
