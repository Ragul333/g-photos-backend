const mongoose = require('mongoose');

const albumPhotoSchema = new mongoose.Schema({
  albumId: { type: mongoose.Schema.Types.ObjectId, ref: 'Album', required: true },
  photoId: { type: mongoose.Schema.Types.ObjectId, ref: 'Photo', required: true },
}, { timestamps: true });

albumPhotoSchema.index({ albumId: 1, photoId: 1 }, { unique: true });

module.exports = mongoose.model('AlbumPhoto', albumPhotoSchema);
