const { default: mongoose } = require('mongoose');
const Tag = require('../models/tag.model');
const PhotoTag = require('../models/photoTag.model');

class TagService {
  static async createTag(name) {
    const existing = await Tag.findOne({ name });
    if (existing) throw new Error('Tag already exists');
    return Tag.create({ name });
  }

  static async getAllTags() {
    return Tag.find({}).sort({ name: 1 });
  }

static async updatePhotoTags(photoId, tagNames) {
    if (!Array.isArray(tagNames)) throw new Error('tagNames must be an array');
  
    const existingTags = await Tag.find({ name: { $in: tagNames } });
    const existingTagMap = new Map(existingTags.map(tag => [tag.name, tag]));

    const newTagNames = tagNames.filter(name => !existingTagMap.has(name));
    const newTags = await Tag.insertMany(newTagNames.map(name => ({ name })));
    
    const allTags = [...existingTags, ...newTags];

    await PhotoTag.deleteMany({ photoId });
  
    const photoTagLinks = allTags.map(tag => ({
      photoId,
      tagId: tag._id
    }));
    await PhotoTag.insertMany(photoTagLinks);
  
    return allTags; 
  }
  

  static async getTagsByPhotoId(photoId) {
    const photoTags = await PhotoTag.find({ photoId }).populate('tagId');
    return photoTags.map(pt => pt.tagId);
  }
  
}

module.exports = TagService;
