const { default: mongoose } = require("mongoose");

const photoTagSchema = new mongoose.Schema({
    photoId: { type: mongoose.Schema.Types.ObjectId, ref: 'Photo', required: true },
    tagId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tag', required: true }
  });
  
 
  photoTagSchema.index({ photoId: 1, tagId: 1 }, { unique: true });
  
  module.exports = mongoose.model('PhotoTag', photoTagSchema);
  