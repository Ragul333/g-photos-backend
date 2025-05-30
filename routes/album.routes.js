const express = require('express');
const AlbumController = require('../controllers/album.controller');

const router = express.Router();

router.post('/', AlbumController.createAlbum);
router.post('/add-photo', AlbumController.addPhotoToAlbum);
router.post('/remove-photo', AlbumController.removePhotoFromAlbum);
router.get('/', AlbumController.getAllAlbums);
router.get('/:albumId/photos', AlbumController.getAlbumPhotos);

module.exports = router;
