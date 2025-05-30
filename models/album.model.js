const mongoose = require('mongoose');

const albumSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
}, { timestamps: true });

albumSchema.index({ name: 'text', description: 'text' });

module.exports = mongoose.model('Album', albumSchema);
