const express = require('express');
const multer = require('multer');
const PhotoController = require('../controllers/photo.controller');

const router = express.Router();
const upload = multer();

router.post('/upload', upload.single('file'), PhotoController.uploadPhoto);
router.put('/trash/:id', PhotoController.trashPhoto);
router.put('/restore/:id', PhotoController.restorePhoto);
router.put('/favorite/:id', PhotoController.toggleFavorite);
router.get('/', PhotoController.getAllPhotos);
router.get('/trash', PhotoController.getTrashPhotos);
router.get('/favorites', PhotoController.getFavorites);

module.exports = router;
