const Favorite = require('../models/favorite.model');
const Photo = require('../models/photo.model');
const moment = require('moment')

class FavoriteService {
    static async toggleFavorite(photoId) {
        const existingFavorite = await Favorite.findOne({ photoId });

        if (existingFavorite) {
            await Favorite.deleteOne({ _id: existingFavorite._id });
            return { favorited: false };
        } else {
            await Favorite.create({ photoId });
            return { favorited: true };
        }
    }

    static async getFavoritePhotoIds() {
        const favorites = await Favorite.find({});
        return new Set(favorites.map(fav => fav.photoId.toString()));
    }

    static async getFavoritePhotos() {
        const favoritePhotoIds = await this.getFavoritePhotoIds();

        const photos = await Photo.find({
            _id: { $in: Array.from(favoritePhotoIds) },
            isTrashed: false
        })
            .sort({ createdAt: -1 })
            .populate('albumId')
            .populate('tagIds');

        const groups = {};
        let currentGroupKey = null;
        let previousTime = null;

        for (const photo of photos) {
            const photoObj = photo.toObject();
            photoObj.isFavorite = true;

            const currentTime = new Date(photo.createdAt).getTime();

            if (!previousTime || previousTime - currentTime <= 5 * 60 * 1000) {
                if (!currentGroupKey) {
                    currentGroupKey = moment(photo.createdAt).format('MMMM Do YYYY, h:mm A');
                    groups[currentGroupKey] = [];
                }
                groups[currentGroupKey].push(photoObj);
            } else {
                currentGroupKey = moment(photo.createdAt).format('MMMM Do YYYY, h:mm A');
                groups[currentGroupKey] = [photoObj];
            }

            previousTime = currentTime;
        }

        return groups;
    }
}

module.exports = FavoriteService;
