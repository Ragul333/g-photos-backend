const AlbumPhotoService = require('../services/albumPhoto.service');
const catchAsync = require('../utils/catchAsync');

class AlbumPhotoController {
  static add(req, res) {
    return catchAsync(async () => {
      const { albumId, photoId } = req.body;
      const result = await AlbumPhotoService.addPhotoToAlbum(albumId, photoId);
      res.status(201).json({ status: 'success', data: result });
    })(req, res);
  }

  static remove(req, res) {
    return catchAsync(async () => {
      const { albumId, photoId } = req.body;
      const result = await AlbumPhotoService.removePhotoFromAlbum(albumId, photoId);
      res.status(200).json({ status: 'success', data: result });
    })(req, res);
  }

  static getPhotos(req, res) {
    return catchAsync(async () => {
      const { albumId } = req.params;
      const result = await AlbumPhotoService.getPhotosInAlbum(albumId);
      res.status(200).json({ status: 'success', data: result });
    })(req, res);
  }
}

module.exports = AlbumPhotoController;
