const moment = require('moment');
const { v4: uuidv4 } = require('uuid');
const { AppError } = require('../middlewares/error.middleware');
const Photo = require('../models/photo.model');
const s3 = require('../utils/s3Client');
const Tag = require('../models/tag.model');
const TagService = require('./tag.service');
const FavoriteService = require('./favorite.service');

class PhotoService {
    static async uploadPhotos(files, body) {
        if (!files || !files.length) {
            throw new AppError('No files uploaded', 400);
        }

        const uploadedPhotos = [];

        for (let fileIndex = 0; fileIndex < files.length; fileIndex++) {
            const file = files[fileIndex];
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

            const title = Array.isArray(body.titles) ? body.titles[fileIndex] : body.titles;
            const description = Array.isArray(body.descriptions) ? body.descriptions[fileIndex] : body.descriptions;

            const photoDoc = await Photo.create({
                title: title,
                description: description || '',
                path: uploadResult.Key,
            });

            uploadedPhotos.push(photoDoc);
        }

        return uploadedPhotos;
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
        const photos = await Photo.find({ isTrashed: false })
            .sort({ createdAt: -1 })
            .populate('albumId')
            .populate('tagIds');

        const favoritePhotoIds = await FavoriteService.getFavoritePhotoIds();

        const groups = {};
        let currentGroupKey = null;
        let previousTime = null;

        for (const photo of photos) {
            const photoObj = photo.toObject();
            photoObj.isFavorite = favoritePhotoIds.has(photo._id.toString());

            const currentTime = new Date(photo.createdAt).getTime();

            if (
                !previousTime ||
                previousTime - currentTime <= 5 * 60 * 1000 // group within 5 minutes
            ) {
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

    static async getPhotoMetadata(photoId) {
        const photo = await Photo.findById(photoId);
        if (!photo) throw new AppError('Photo not found', 404);

        const tags = await TagService.getTagsByPhotoId(photoId);
        const tagNames = tags.map(t => t.name);
        return {
            ...photo.toObject(),
            tags: tagNames,
        };
    }
    static async updatePhotoMetadata(id, updateData) {
        const photo = await Photo.findById(id);
        if (!photo) throw new AppError('Photo not found', 404);

        const { title, description, tagNames, albumId } = updateData;

        if (title !== undefined) photo.title = title;
        if (description !== undefined) photo.description = description;
        if (albumId) photo.albumId = albumId;

        await photo.save();

        if (Array.isArray(tagNames)) {

            await Tag.deleteMany({ photoId: id });


            const newTags = tagNames.map(name => ({ photoId: id, name }));
            const insertedTags = await Tag.insertMany(newTags);

            photo.tagIds = insertedTags.map(t => t._id);
            await photo.save();
        }

        return photo;
    }


    static async searchPhotos({ q, album, tag }) {
        const matchConditions = [{ isTrashed: false }];

        if (q) {
            matchConditions.push({
                $or: [
                    { title: { $regex: q, $options: 'i' } },
                    { description: { $regex: q, $options: 'i' } },
                    { 'albums.name': { $regex: q, $options: 'i' } },
                    { 'tags.name': { $regex: q, $options: 'i' } }
                ]
            });
        }

        if (album) {
            matchConditions.push({
                $or: [
                    { 'albums.name': { $regex: album, $options: 'i' } },
                    { albums: { $size: 0 } } // include photos with no albums
                ]
            });
        }

        if (tag) {
            matchConditions.push({
                'tags.name': { $regex: tag, $options: 'i' }
            });
        }

        const pipeline = [
            { $match: { isTrashed: false } },

            {
                $lookup: {
                    from: 'albumphotos',
                    localField: '_id',
                    foreignField: 'photoId',
                    as: 'albumPhotos'
                }
            },

            {
                $lookup: {
                    from: 'albums',
                    localField: 'albumPhotos.albumId',
                    foreignField: '_id',
                    as: 'albums'
                }
            },

            {
                $lookup: {
                    from: 'phototags',
                    localField: '_id',
                    foreignField: 'photoId',
                    as: 'photoTags'
                }
            },

            {
                $lookup: {
                    from: 'tags',
                    localField: 'photoTags.tagId',
                    foreignField: '_id',
                    as: 'tags'
                }
            },

            { $match: { $and: matchConditions } },

            { $sort: { createdAt: -1 } }
        ];

        return await Photo.aggregate(pipeline);
    }

}

module.exports = PhotoService;