const AlbumService = require('../services/album.service');
const catchAsync = require('../utils/catchAsync');

class AlbumController {
  static createAlbum(req, res) {
    return catchAsync(async () => {
      const album = await AlbumService.createAlbum(req.body);
      res.status(201).json(album);
    })(req, res);
  }

  static addPhotoToAlbum(req, res) {
    return catchAsync(async () => {
      const { albumId, photoId } = req.body;
      await AlbumService.addPhotoToAlbum(albumId, photoId);
      res.status(200).json({ message: 'Photo added to album' });
    })(req, res);
  }

  static removePhotoFromAlbum(req, res) {
    return catchAsync(async () => {
      const { albumId, photoId } = req.body;
      await AlbumService.removePhotoFromAlbum(albumId, photoId);
      res.status(200).json({ message: 'Photo removed from album' });
    })(req, res);
  }

  static getAlbumPhotos(req, res) {
    return catchAsync(async () => {
      const { albumId } = req.params;
      const photos = await AlbumService.getPhotosInAlbum(albumId);
      res.status(200).json(photos);
    })(req, res);
  }

  static getAllAlbums(req, res) {
    return catchAsync(async () => {
      const albums = await AlbumService.getAllAlbums();
      res.status(200).json(albums);
    })(req, res);
  }
}

module.exports = AlbumController;
