const Booking = require('../models/Booking');
const Space = require('../models/Space');
const User = require('../models/User');
const mongoose = require('mongoose');

const createBooking = async (req, res) => {
    const { spaceId, userId, startTime, endTime } = req.body;
    
    try {
        const space = await Space.findById(spaceId);
        if (!space) {
            return res.status(404).json({ error: 'Espacio no encontrado' });
        }
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }
        const start = new Date(startTime);
        const end = new Date(endTime);
        if (end <= start) {
            return res.status(400).json({ error: 'La hora de finalización debe ser posterior a la hora de inicio' });
        }
        const existingBookings = await Booking.find({
            space: spaceId,
            status: 'confirmed',
            $or: [
                { startTime: { $lt: end }, endTime: { $gt: start } },
                { startTime: { $gte: start }, endTime: { $lte: end } }
            ]
        });
        if (existingBookings.length > 0) {
            return res.status(400).json({ error: 'El espacio ya está reservado en ese horario' });
        }
        const booking = new Booking({
            space: spaceId,
            user: userId,
            startTime,
            endTime,
            status: 'confirmed'
        });
        await booking.save();
        res.status(201).json(booking);
    }
    catch (error) {
        console.error('Error al crear la reserva:', error);
        res.status(500).json({ error: 'Error al crear la reserva' });
    }
}

const getBookings = async (req, res) => {
    const { userId } = req.query;
    
    try {
        const filter = userId ? { user: userId } : {};
        const bookings = await Booking.find(filter).populate('space');
        res.json(bookings);
    } catch (error) {
        console.error('Error al obtener reservas:', error);
        res.status(500).json({ error: 'Error al obtener reservas' });
    }
};

const updateBookingStatus = async (req, res) => {
    const { bookingId, status } = req.body;
    
    try {
        const booking = await Booking
            .findByIdAndUpdate(bookingId, { status }, { new: true })
            .populate('space');
        if (!booking) {
            return res.status(404).json({ error: 'Reserva no encontrada' });
        }
        res.json(booking);
    }
    catch (error) {
        console.error('Error al actualizar el estado de la reserva:', error);
        res.status(500).json({ error: 'Error al actualizar el estado de la reserva' });
    }
}

module.exports = {
    createBooking,
    getBookings,
    updateBookingStatus
};