const catchAsync = require('../utils/catchAsync');
const FavoriteService = require('../services/favorite.service');

class FavoriteController {
  static toggleFavorite(req, res) {
    return catchAsync(async () => {
      const photoId = req.params.id;
      const result = await FavoriteService.toggleFavorite(photoId);
      res.status(200).json({ status: 'success', favorited: result.favorited });
    })(req, res);
  }

  static getAllFavorites(req, res) {
    return catchAsync(async () => {
      const favorites = await FavoriteService.getFavoritePhotos();
      res.status(200).json({ status: 'success', data: favorites });
    })(req, res);
  }
}

module.exports = FavoriteController;
