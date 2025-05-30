// services/album.service.js
const Album = require('../models/album.model');
const AlbumPhoto = require('../models/albumphoto.model');
const Photo = require('../models/photo.model');
const { AppError } = require('../middlewares/error.middleware');

class AlbumService {
  static async createAlbum(data) {
    return await Album.create(data);
  }

  static async addPhotoToAlbum(albumId, photoId) {
    return await AlbumPhoto.create({ albumId, photoId });
  }

  static async removePhotoFromAlbum(albumId, photoId) {
    const result = await AlbumPhoto.findOneAndDelete({ albumId, photoId });
    if (!result) throw new AppError('Photo not found in album', 404);
  }

  static async getPhotosInAlbum(albumId) {
    const albumPhotos = await AlbumPhoto.find({ albumId }).populate('photoId');
    return albumPhotos.map(entry => entry.photoId);
  }

  static async getAllAlbums() {
    return await Album.find().sort({ createdAt: -1 });
  }
}

module.exports = AlbumService;
