const mongoose = require('mongoose');

const photoSchema = new mongoose.Schema({
  title: String,
  description: String,
  path: { type: String, required: true },
  albumId: { type: mongoose.Schema.Types.ObjectId, ref: 'Album' },
  tagIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tag' }],
  isTrashed: { type: Boolean, default: false },
}, { timestamps: true });

photoSchema.index({ title: 'text', description: 'text' });

module.exports = mongoose.model('Photo', photoSchema);
