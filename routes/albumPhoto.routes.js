const express = require('express');
const router = express.Router();
const AlbumPhotoController = require('../controllers/albumPhoto.controller');

router.post('/', AlbumPhotoController.add);
router.delete('/', AlbumPhotoController.remove);
router.get('/:albumId', AlbumPhotoController.getPhotos);

module.exports = router;
