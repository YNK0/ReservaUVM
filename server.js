require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const db = require('./config/db');

const app = express();
app.use(cors());
app.use(express.json());

// Conectar a la base de datos
db();

// Rutas
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/spaces', require('./routes/spaceRoutes'));
app.use('/api/bookings', require('./routes/bookingRoutes'));

// Manejo de errores
app.use(require('./middleware/errorHandler'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});