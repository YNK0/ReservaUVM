const mongoose = require('mongoose');
const Booking = require('../models/Booking');
const Space = require('../models/Space');

const createBooking = async (userId, spaceId, startTime, endTime) => {
  const conflictingBooking = await Booking.findOne({
    space: spaceId,
    startTime: { $lt: endTime },
    endTime: { $gt: startTime },
    status: 'confirmed'
  });

  if (conflictingBooking) {
    throw new Error('El espacio no está disponible en ese horario');
  }

  const booking = new Booking({
    user: userId,
    space: spaceId,
    startTime,
    endTime
  });

  await booking.save();
  return booking;
};

const cancelBooking = async (bookingId, userId) => {
  const booking = await Booking.findOne({ _id: bookingId, user: userId });
  if (!booking) throw new Error('Reserva no encontrada');
  
  booking.status = 'cancelled';
  await booking.save();
  return booking;
};

const getBookingsByUser = async (userId) => {
  return await Booking.find({ user: userId }).populate('space');
};
const getBookingsBySpace = async (spaceId) => {
  return await Booking.find({ space: spaceId }).populate('user');
};
const getBookingById = async (bookingId) => {
  return await Booking.findById(bookingId)
    .populate('user')
    .populate('space');
}
const getAllBookings = async () => {
  return await Booking.find().populate('user').populate('space');
};
module.exports = {
  createBooking,
  cancelBooking,
  getBookingsByUser,
  getBookingsBySpace,
  getBookingById,
  getAllBookings
};