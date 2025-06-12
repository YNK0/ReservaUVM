const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const auth = require('../middleware/auth');

// Crear reserva (requiere autenticación)
router.post('/', auth, bookingController.createBooking);

// Obtener reservas (puede filtrar por usuario)
router.get('/', auth, bookingController.getBookings);

// Actualizar estado de reserva
router.put('/status', auth, bookingController.updateBookingStatus);

module.exports = router;