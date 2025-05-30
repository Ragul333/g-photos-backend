const AlbumPhoto = require('../models/albumphoto.model');
const { AppError } = require('../middlewares/error.middleware');

class AlbumPhotoService {
  static async addPhotoToAlbum(albumId, photoId) {
    try {
      return await AlbumPhoto.create({ albumId, photoId });
    } catch (err) {
      if (err.code === 11000) throw new AppError('Photo already in album', 400);
      throw err;
    }
  }

  static async removePhotoFromAlbum(albumId, photoId) {
    const result = await AlbumPhoto.findOneAndDelete({ albumId, photoId });
    if (!result) throw new AppError('Photo not found in album', 404);
    return result;
  }

  static async getPhotosInAlbum(albumId) {
    return await AlbumPhoto.find({ albumId }).populate('photoId');
  }
}

module.exports = AlbumPhotoService;
