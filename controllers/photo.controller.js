const PhotoService = require('../services/photo.service');
const catchAsync = require('../utils/catchAsync');

class PhotoController {
    static uploadPhoto = catchAsync(async (req, res) => {
        const photoData = await PhotoService.uploadPhoto(req.file, req.body);
        res.status(201).json({ status: 'success', data: photoData });
    });

    static trashPhoto = catchAsync(async (req, res) => {
        await PhotoService.trashPhoto(req.params.id);
        res.status(200).json({ status: 'success', message: 'Photo moved to trash' });
    });

    static restorePhoto = catchAsync(async (req, res) => {
        await PhotoService.restorePhoto(req.params.id);
        res.status(200).json({ status: 'success', message: 'Photo restored' });
    });

    static toggleFavorite = catchAsync(async (req, res) => {
        const updatedPhoto = await PhotoService.toggleFavorite(req.params.id);
        res.status(200).json({ status: 'success', data: updatedPhoto });
    });

    static getAllPhotos = catchAsync(async (req, res) => {
        const photos = await PhotoService.getAllPhotos();
        res.status(200).json({ status: 'success', data: photos });
    });

    static getFavorites = catchAsync(async (req, res) => {
        const favorites = await PhotoService.getFavorites();
        res.status(200).json({ status: 'success', data: favorites });
    });

    static getTrashPhotos = catchAsync(async (req, res) => {
        const trashPhotos = await PhotoService.getTrashPhotos();
        res.status(200).json({ status: 'success', data: trashPhotos })
    })
}

module.exports = PhotoController;
