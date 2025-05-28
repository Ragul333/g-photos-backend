const httpMocks = require('node-mocks-http');
const PhotoController = require('../controllers/photo.controller');
const PhotoService = require('../services/photo.service');

jest.mock('../services/photo.service');

describe('PhotoController', () => {

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('uploadPhoto', () => {
        it('should upload a photo and return 201', async () => {
            const req = httpMocks.createRequest({
                method: 'POST',
                file: {
                    originalname: 'test.jpg',
                    buffer: Buffer.from('fake image'),
                    mimetype: 'image/jpeg'
                },
                body: {
                    title: 'test photo',
                    description: 'desc'
                }
            });

            const res = httpMocks.createResponse();
            const photoMock = { _id: '123', title: 'test photo', path: 'photo.png' };
            PhotoService.uploadPhoto.mockResolvedValue(photoMock);

            await PhotoController.uploadPhoto(req, res);

            expect(PhotoService.uploadPhoto).toHaveBeenCalledWith(req.file, req.body);
            expect(res.statusCode).toBe(201);
            expect(res._getJSONData()).toEqual({ status: 'success', data: photoMock });
        });
    });

    describe('trashPhoto', () => {
        it('should move a photo to trash and return 200', async () => {
            const req = httpMocks.createRequest({ params: { id: '123' } });
            const res = httpMocks.createResponse();

            PhotoService.trashPhoto.mockResolvedValue();

            await PhotoController.trashPhoto(req, res);

            expect(PhotoService.trashPhoto).toHaveBeenCalledWith('123');
            expect(res.statusCode).toBe(200);
            expect(res._getJSONData()).toEqual({ status: 'success', message: 'Photo moved to trash' });
        });
    });

    describe('restorePhoto', () => {
        it('should restore a photo and return 200', async () => {
            const req = httpMocks.createRequest({ params: { id: '123' } });
            const res = httpMocks.createResponse();

            PhotoService.restorePhoto.mockResolvedValue();

            await PhotoController.restorePhoto(req, res);

            expect(PhotoService.restorePhoto).toHaveBeenCalledWith('123');
            expect(res.statusCode).toBe(200);
            expect(res._getJSONData()).toEqual({ status: 'success', message: 'Photo restored' });
        });
    });

    describe('toggleFavorite', () => {
        it('should toggle favorite and return 200', async () => {
            const req = httpMocks.createRequest({ params: { id: '123' } });
            const res = httpMocks.createResponse();
            const updated = { _id: '123', isFavorite: true };

            PhotoService.toggleFavorite.mockResolvedValue(updated);

            await PhotoController.toggleFavorite(req, res);

            expect(PhotoService.toggleFavorite).toHaveBeenCalledWith('123');
            expect(res.statusCode).toBe(200);
            expect(res._getJSONData()).toEqual({ status: 'success', data: updated });
        });
    });

    describe('getAllPhotos', () => {
        it('should return all photos', async () => {
            const req = httpMocks.createRequest();
            const res = httpMocks.createResponse();
            const mockPhotos = [{ _id: '1' }, { _id: '2' }];

            PhotoService.getAllPhotos.mockResolvedValue(mockPhotos);

            await PhotoController.getAllPhotos(req, res);

            expect(PhotoService.getAllPhotos).toHaveBeenCalled();
            expect(res.statusCode).toBe(200);
            expect(res._getJSONData()).toEqual({ status: 'success', data: mockPhotos });
        });
    });

    describe('getFavorites', () => {
        it('should return favorite photos', async () => {
            const req = httpMocks.createRequest();
            const res = httpMocks.createResponse();
            const mockFavorites = [{ _id: '1', isFavorite: true }];

            PhotoService.getFavorites.mockResolvedValue(mockFavorites);

            await PhotoController.getFavorites(req, res);

            expect(PhotoService.getFavorites).toHaveBeenCalled();
            expect(res.statusCode).toBe(200);
            expect(res._getJSONData()).toEqual({ status: 'success', data: mockFavorites });
        });
    });

    describe('getTrashPhotos', () => {
        it('should return trashed photos', async () => {
            const req = httpMocks.createRequest();
            const res = httpMocks.createResponse();
            const trashPhotos = [{ _id: '1', isTrashed: true }];

            PhotoService.getTrashPhotos.mockResolvedValue(trashPhotos);

            await PhotoController.getTrashPhotos(req, res);

            expect(PhotoService.getTrashPhotos).toHaveBeenCalled();
            expect(res.statusCode).toBe(200);
            expect(res._getJSONData()).toEqual({ status: 'success', data: trashPhotos });
        });
    });
});
