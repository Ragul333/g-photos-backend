const TagService = require('../services/tag.service');
const catchAsync = require('../utils/catchAsync');

class TagController {
  static createTag(req, res) {
    return catchAsync(async () => {
      const tag = await TagService.createTag(req.body.name);
      res.status(201).json(tag);
    })(req, res);
  }

  static getAllTags(req, res) {
    return catchAsync(async () => {
      const tags = await TagService.getAllTags();
      res.status(200).json(tags);
    })(req, res);
  }

  static updatePhotoTags(req, res) {
    return catchAsync(async () => {
      const { id } = req.params;
      const { tags } = req.body;

      if (!Array.isArray(tags)) {
        return res.status(400).json({ status: 'fail', message: 'Tags must be an array of strings.' });
      }

      await TagService.updatePhotoTags(id, tags);

      res.status(200).json({ status: 'success', message: 'Tags updated successfully.' });
    })(req, res);
  }
}

module.exports = TagController;
