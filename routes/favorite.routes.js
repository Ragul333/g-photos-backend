const express = require('express');
const FavoriteController = require('../controllers/favorite.controller');
const router = express.Router();

router.put('/:id', FavoriteController.toggleFavorite);
router.get('/', FavoriteController.getAllFavorites);

module.exports = router;
