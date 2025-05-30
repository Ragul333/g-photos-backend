const express = require('express');
const photoRoutes = require('./photo.routes');
const albumRoutes = require('./album.routes');
const albumPhotoRoutes = require('./albumPhoto.routes');
const favoriteRoutes = require('./favorite.routes');
const photoTagRoutes = require('./photoTag.routes');

const router = express.Router();

router.use('/photos', photoRoutes);
router.use('/albums', albumRoutes);
router.use('/album-photos', albumPhotoRoutes);
router.use('/favorites', favoriteRoutes);
router.use('/tags', photoTagRoutes);

module.exports = router;
