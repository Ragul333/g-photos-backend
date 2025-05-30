const express = require('express');
const TagController = require('../controllers/tag.controller');

const router = express.Router();

router.post('/', TagController.createTag);
router.get('/', TagController.getAllTags);
router.patch('/:id', TagController.updatePhotoTags);
router.put('/:id', TagController.updatePhotoTags);
  

module.exports = router;