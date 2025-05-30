const PhotoService = require('../services/photo.service');
const catchAsync = require('../utils/catchAsync');
const Tag = require('../models/tag.model');
const PhotoTag = require('../models/photoTag.model');
const mongoose = require('mongoose');

class PhotoController {
  static uploadPhoto(req, res) {
    return catchAsync(async () => {
      const photoData = await PhotoService.uploadPhotos(req.files, req.body);
      res.status(201).json({ status: 'success', data: photoData });
    })(req, res);
  }

  static trashPhoto(req, res) {
    return catchAsync(async () => {
      await PhotoService.trashPhoto(req.params.id);
      res.status(200).json({ status: 'success', message: 'Photo moved to trash' });
    })(req, res);
  }

  static restorePhoto(req, res) {
    return catchAsync(async () => {
      await PhotoService.restorePhoto(req.params.id);
      res.status(200).json({ status: 'success', message: 'Photo restored' });
    })(req, res);
  }

  static toggleFavorite(req, res) {
    return catchAsync(async () => {
      const updatedPhoto = await PhotoService.toggleFavorite(req.params.id);
      res.status(200).json({ status: 'success', data: updatedPhoto });
    })(req, res);
  }

  static getAllPhotos(req, res) {
    return catchAsync(async () => {
      const photos = await PhotoService.getAllPhotos();
      res.status(200).json({ status: 'success', data: photos });
    })(req, res);
  }

  static getFavorites(req, res) {
    return catchAsync(async () => {
      const favorites = await PhotoService.getFavorites();
      res.status(200).json({ status: 'success', data: favorites });
    })(req, res);
  }

  static getTrashPhotos(req, res) {
    return catchAsync(async () => {
      const trashPhotos = await PhotoService.getTrashPhotos();
      res.status(200).json({ status: 'success', data: trashPhotos });
    })(req, res);
  }

  static searchPhotos(req, res) {
    return catchAsync(async () => {
      const { q, album, tag } = req.query;
      const photos = await PhotoService.searchPhotos({ q, album, tag });
      res.status(200).json({ status: 'success', data: photos });
    })(req, res);
  }

  static updatePhotoMetadata(req, res) {
    return catchAsync(async () => {
      const { id } = req.params;
      const updatedPhoto = await PhotoService.updatePhotoMetadata(id, req.body);
      res.status(200).json({ status: 'success', data: updatedPhoto });
    })(req, res);
  }

  static getPhotoMetadata(req, res) {
    return catchAsync(async () => {
      const { id } = req.params;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ status: 'error', message: 'Invalid photoId' });
      }

      const photoWithTags = await PhotoService.getPhotoMetadata(id);
      res.status(200).json({ status: 'success', data: photoWithTags });
    })(req, res);
  }

  static async updatePhotoMetadataWithTags(req, res) {
    const { id } = req.params;
    const { title, description, tags, albumId } = req.body;
  
    let tagDocs = [];
  
    if (Array.isArray(tags)) {
      const existingTags = await Tag.find({ name: { $in: tags } });
      const existingTagNames = existingTags.map(tag => tag.name);
      const newTagNames = tags.filter(tag => !existingTagNames.includes(tag));
  
      const newTags = await Tag.insertMany(
        newTagNames.map(name => ({ name })),
        { ordered: false }
      ).catch(() => []);
  
      tagDocs = [...existingTags, ...newTags];
  
      await PhotoTag.deleteMany({ photoId: id });
      const photoTagLinks = tagDocs.map(tag => ({
        photoId: id,
        tagId: tag._id,
      }));
      await PhotoTag.insertMany(photoTagLinks);
    }
  
    const updateData = { title, description, albumId };
    const updatedPhoto = await PhotoService.updatePhotoMetadata(id, updateData);
  
    const tagsToReturn = tagDocs.map(tag => tag.name);
  
    res.status(200).json({
      status: 'success',
      data: {
        ...updatedPhoto.toObject(),
        tags: tagsToReturn,
      },
    });
  }
  
}

module.exports = PhotoController;
