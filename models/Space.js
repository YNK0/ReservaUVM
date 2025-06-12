const mongoose = require('mongoose');

const spaceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, enum: ['aula', 'laboratorio', 'sala'], required: true },
  capacity: Number,
  equipment: [String],
  location: { type: String, required: true },
  imageUrl: String
});

const Space = mongoose.model('Space', spaceSchema);
module.exports = Space;