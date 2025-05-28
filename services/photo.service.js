const moment = require('moment');
const { v4: uuidv4 } = require('uuid');
const { AppError } = require('../middlewares/error.middleware');
const Photo = require('../models/photo.model');
const s3 = require('../utils/s3Client');

class PhotoService {
    static async uploadPhoto(file, body) {
        if (!file) throw new AppError('No file uploaded', 400);

        const ext = file.originalname.split('.').pop();
        const fileName = `${uuidv4()}.${ext}`;

        const params = {
            Key: fileName,
            Body: file.buffer,
            ContentType: file.mimetype,
        };

        const uploadResult = await new Promise((resolve, reject) => {
            s3.upload(params, (err, data) => {
                if (err) return reject(err);
                resolve(data);
            });
        });

        console.log({ uploadResult })

        const photoDoc = await Photo.create({
            title: body.title || file.originalname,
            description: body.description || '',
            path: uploadResult.Key,
        });

        return photoDoc;
    }

    static async trashPhoto(id) {
        const photo = await Photo.findById(id);
        if (!photo) throw new AppError('Photo not found', 404);

        photo.isTrashed = true;
        await photo.save();
    }

    static async restorePhoto(id) {
        const photo = await Photo.findById(id);
        if (!photo) throw new AppError('Photo not found', 404);

        photo.isTrashed = false;
        await photo.save();
    }

    static async toggleFavorite(id) {
        const photo = await Photo.findById(id);
        if (!photo) throw new AppError('Photo not found', 404);

        photo.isFavorite = !photo.isFavorite;
        await photo.save();
        return photo;
    }


    static async getAllPhotos() {
        const photos = await Photo.find({ isTrashed: false }).sort({ createdAt: -1 });

        const groups = {};
        let currentGroupKey = null;
        let previousTime = null;

        for (const photo of photos) {
            const currentTime = new Date(photo.createdAt).getTime();

            if (
                !previousTime ||
                previousTime - currentTime <= 5 * 60 * 1000
            ) {
                if (!currentGroupKey) {
                    currentGroupKey = moment(photo.createdAt).format('MMMM Do YYYY, h:mm A');
                    groups[currentGroupKey] = [];
                }
                groups[currentGroupKey].push(photo);
            } else {
                currentGroupKey = moment(photo.createdAt).format('MMMM Do YYYY, h:mm A');
                groups[currentGroupKey] = [photo];
            }

            previousTime = currentTime;
        }

        return groups;
    }



    static async getFavorites() {
        const photos = await Photo.find({ isTrashed: false, isFavorite: true }).sort({ createdAt: -1 });

        const groups = {};
        let currentGroupKey = null;
        let previousTime = null;

        for (const photo of photos) {
            const currentTime = new Date(photo.createdAt).getTime();

            if (
                !previousTime ||
                previousTime - currentTime <= 5 * 60 * 1000
            ) {
                if (!currentGroupKey) {
                    currentGroupKey = moment(photo.createdAt).format('MMMM Do YYYY, h:mm A');
                    groups[currentGroupKey] = [];
                }
                groups[currentGroupKey].push(photo);
            } else {
                currentGroupKey = moment(photo.createdAt).format('MMMM Do YYYY, h:mm A');
                groups[currentGroupKey] = [photo];
            }

            previousTime = currentTime;
        }

        return groups;
    }

    static async getTrashPhotos() {
        const photos = await Photo.find({ isTrashed: true }).sort({ createdAt: -1 });

        const groups = {};
        let currentGroupKey = null;
        let previousTime = null;

        for (const photo of photos) {
            const currentTime = new Date(photo.createdAt).getTime();

            if (
                !previousTime ||
                previousTime - currentTime <= 5 * 60 * 1000
            ) {
                if (!currentGroupKey) {
                    currentGroupKey = moment(photo.createdAt).format('MMMM Do YYYY, h:mm A');
                    groups[currentGroupKey] = [];
                }
                groups[currentGroupKey].push(photo);
            } else {
                currentGroupKey = moment(photo.createdAt).format('MMMM Do YYYY, h:mm A');
                groups[currentGroupKey] = [photo];
            }

            previousTime = currentTime;
        }

        return groups;

    }

}

module.exports = PhotoService;