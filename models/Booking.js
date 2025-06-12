const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  space: { type: mongoose.Schema.Types.ObjectId, ref: 'Space', required: true },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  status: { type: String, enum: ['confirmed', 'cancelled'], default: 'confirmed' }
}, { timestamps: true });

const Booking = mongoose.model('Booking', bookingSchema);
module.exports = Booking;