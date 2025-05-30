const httpMocks = require('node-mocks-http');
const mongoose = require('mongoose');
const PhotoController = require('../controllers/photo.controller');
const PhotoService = require('../services/photo.service');
const Tag = require('../models/tag.model');
const PhotoTag = require('../models/photoTag.model');

jest.mock('../services/photo.service');
jest.mock('../models/tag.model');
jest.mock('../models/photoTag.model');

describe('PhotoController', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('uploadPhoto', () => {
    it('should upload photos and respond with 201 and data', async () => {
      const req = httpMocks.createRequest({
        method: 'POST',
        files: [{ originalname: 'photo1.jpg' }],
        body: { title: 'My Photo' },
      });
      const res = httpMocks.createResponse();
      const mockData = { id: 'abc123', title: 'My Photo' };

      PhotoService.uploadPhotos.mockResolvedValue(mockData);

      await PhotoController.uploadPhoto(req, res);

      expect(PhotoService.uploadPhotos).toHaveBeenCalledWith(req.files, req.body);
      expect(res.statusCode).toBe(201);
      expect(res._getJSONData()).toEqual({ status: 'success', data: mockData });
    });
  });

  describe('trashPhoto', () => {
    it('should move photo to trash and respond 200 with message', async () => {
      const req = httpMocks.createRequest({ params: { id: 'photoId123' } });
      const res = httpMocks.createResponse();

      PhotoService.trashPhoto.mockResolvedValue();

      await PhotoController.trashPhoto(req, res);

      expect(PhotoService.trashPhoto).toHaveBeenCalledWith('photoId123');
      expect(res.statusCode).toBe(200);
      expect(res._getJSONData()).toEqual({ status: 'success', message: 'Photo moved to trash' });
    });
  });

  describe('restorePhoto', () => {
    it('should restore photo and respond 200 with message', async () => {
      const req = httpMocks.createRequest({ params: { id: 'photoId456' } });
      const res = httpMocks.createResponse();

      PhotoService.restorePhoto.mockResolvedValue();

      await PhotoController.restorePhoto(req, res);

      expect(PhotoService.restorePhoto).toHaveBeenCalledWith('photoId456');
      expect(res.statusCode).toBe(200);
      expect(res._getJSONData()).toEqual({ status: 'success', message: 'Photo restored' });
    });
  });

  describe('getAllPhotos', () => {
    it('should get all photos and respond 200 with data', async () => {
      const req = httpMocks.createRequest();
      const res = httpMocks.createResponse();
      const photos = [{ id: 1 }, { id: 2 }];

      PhotoService.getAllPhotos.mockResolvedValue(photos);

      await PhotoController.getAllPhotos(req, res);

      expect(PhotoService.getAllPhotos).toHaveBeenCalled();
      expect(res.statusCode).toBe(200);
      expect(res._getJSONData()).toEqual({ status: 'success', data: photos });
    });
  });

  describe('searchPhotos', () => {
    it('should search photos and respond 200 with data', async () => {
      const req = httpMocks.createRequest({
        query: { q: 'sunset', album: 'album1', tag: 'nature' }
      });
      const res = httpMocks.createResponse();
      const searchResult = [{ id: '1', title: 'Sunset' }];

      PhotoService.searchPhotos.mockResolvedValue(searchResult);

      await PhotoController.searchPhotos(req, res);

      expect(PhotoService.searchPhotos).toHaveBeenCalledWith({ q: 'sunset', album: 'album1', tag: 'nature' });
      expect(res.statusCode).toBe(200);
      expect(res._getJSONData()).toEqual({ status: 'success', data: searchResult });
    });
  });

  describe('updatePhotoMetadata', () => {
    it('should update photo metadata and respond 200 with updated photo', async () => {
      const req = httpMocks.createRequest({
        params: { id: 'photo123' },
        body: { title: 'New Title', description: 'New desc' },
      });
      const res = httpMocks.createResponse();
      const updatedPhoto = { id: 'photo123', title: 'New Title', description: 'New desc' };

      PhotoService.updatePhotoMetadata.mockResolvedValue(updatedPhoto);

      await PhotoController.updatePhotoMetadata(req, res);

      expect(PhotoService.updatePhotoMetadata).toHaveBeenCalledWith('photo123', req.body);
      expect(res.statusCode).toBe(200);
      expect(res._getJSONData()).toEqual({ status: 'success', data: updatedPhoto });
    });
  });

  describe('getPhotoMetadata', () => {
    it('should return 400 if invalid photo id', async () => {
      const req = httpMocks.createRequest({ params: { id: 'invalid-id' } });
      const res = httpMocks.createResponse();

      // Mock invalid ObjectId check
      jest.spyOn(mongoose.Types.ObjectId, 'isValid').mockReturnValue(false);

      await PhotoController.getPhotoMetadata(req, res);

      expect(res.statusCode).toBe(400);
      expect(res._getJSONData()).toEqual({ status: 'error', message: 'Invalid photoId' });
    });

    it('should return photo metadata with tags if valid id', async () => {
      const req = httpMocks.createRequest({ params: { id: 'validid123456789012345678' } });
      const res = httpMocks.createResponse();
      const mockData = { id: 'validid123456789012345678', title: 'photo', tags: ['tag1'] };

      jest.spyOn(mongoose.Types.ObjectId, 'isValid').mockReturnValue(true);
      PhotoService.getPhotoMetadata.mockResolvedValue(mockData);

      await PhotoController.getPhotoMetadata(req, res);

      expect(PhotoService.getPhotoMetadata).toHaveBeenCalledWith('validid123456789012345678');
      expect(res.statusCode).toBe(200);
      expect(res._getJSONData()).toEqual({ status: 'success', data: mockData });
    });
  });

  describe('updatePhotoMetadataWithTags', () => {
    it('should update photo metadata and tags and respond with updated data', async () => {
      const req = httpMocks.createRequest({
        params: { id: 'photoid123' },
        body: {
          title: 'Title with tags',
          description: 'Description',
          tags: ['tag1', 'tag2'],
          albumId: 'album123',
        },
      });
      const res = httpMocks.createResponse();

      // Mock Tags found in DB
      const existingTags = [
        { _id: 'tagid1', name: 'tag1', toObject: () => ({ _id: 'tagid1', name: 'tag1' }) },
      ];
      Tag.find.mockResolvedValue(existingTags);

      // Mock Tag.insertMany creates new tags (tag2)
      const newTags = [
        { _id: 'tagid2', name: 'tag2', toObject: () => ({ _id: 'tagid2', name: 'tag2' }) },
      ];
      Tag.insertMany.mockResolvedValue(newTags);

      // Mock deleteMany and insertMany on PhotoTag
      PhotoTag.deleteMany.mockResolvedValue();
      PhotoTag.insertMany.mockResolvedValue();

      // Mock PhotoService.updatePhotoMetadata to return updated photo
      const updatedPhoto = {
        toObject: () => ({ id: 'photoid123', title: 'Title with tags', description: 'Description', albumId: 'album123' }),
      };
      PhotoService.updatePhotoMetadata.mockResolvedValue(updatedPhoto);

      await PhotoController.updatePhotoMetadataWithTags(req, res);

      expect(Tag.find).toHaveBeenCalledWith({ name: { $in: ['tag1', 'tag2'] } });
      expect(Tag.insertMany).toHaveBeenCalledWith([{ name: 'tag2' }], { ordered: false });
      expect(PhotoTag.deleteMany).toHaveBeenCalledWith({ photoId: 'photoid123' });
      expect(PhotoTag.insertMany).toHaveBeenCalledWith([
        { photoId: 'photoid123', tagId: 'tagid1' },
        { photoId: 'photoid123', tagId: 'tagid2' },
      ]);
      expect(PhotoService.updatePhotoMetadata).toHaveBeenCalledWith('photoid123', {
        title: 'Title with tags',
        description: 'Description',
        albumId: 'album123',
      });

      expect(res.statusCode).toBe(200);
      expect(res._getJSONData()).toEqual({
        status: 'success',
        data: {
          id: 'photoid123',
          title: 'Title with tags',
          description: 'Description',
          albumId: 'album123',
          tags: ['tag1', 'tag2'],
        },
      });
    });

    it('should handle empty or no tags gracefully', async () => {
      const req = httpMocks.createRequest({
        params: { id: 'photoid123' },
        body: {
          title: 'No Tags',
          description: 'Desc',
          tags: null,
          albumId: 'album123',
        },
      });
      const res = httpMocks.createResponse();

      const updatedPhoto = {
        toObject: () => ({ id: 'photoid123', title: 'No Tags', description: 'Desc', albumId: 'album123' }),
      };
      PhotoService.updatePhotoMetadata.mockResolvedValue(updatedPhoto);

      await PhotoController.updatePhotoMetadataWithTags(req, res);

      // Should not call Tag or PhotoTag methods when tags is not an array
      expect(Tag.find).not.toHaveBeenCalled();
      expect(Tag.insertMany).not.toHaveBeenCalled();
      expect(PhotoTag.deleteMany).not.toHaveBeenCalled();
      expect(PhotoTag.insertMany).not.toHaveBeenCalled();

      expect(PhotoService.updatePhotoMetadata).toHaveBeenCalledWith('photoid123', {
        title: 'No Tags',
        description: 'Desc',
        albumId: 'album123',
      });

      expect(res.statusCode).toBe(200);
      expect(res._getJSONData()).toEqual({
        status: 'success',
        data: {
          id: 'photoid123',
          title: 'No Tags',
          description: 'Desc',
          albumId: 'album123',
          tags: [],
        },
      });
    });
  });
});
