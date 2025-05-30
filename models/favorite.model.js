const mongoose = require('mongoose');

const favoriteSchema = new mongoose.Schema({
  photoId: { type: mongoose.Schema.Types.ObjectId, ref: 'Photo', required: true },
}, { timestamps: true });

favoriteSchema.index({ photoId: 1 }, { unique: true });

module.exports = mongoose.model('Favorite', favoriteSchema);
