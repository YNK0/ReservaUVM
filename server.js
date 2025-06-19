require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./config/db');

const app = express();
app.use(express.json());

const allowedOrigins = ['https://ruvm.vercel.app', 'http://localhost:5173'];

app.use(cors({
  origin: function(origin, callback) {
    // Permite solicitudes sin origen (ejemplo Postman)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      return callback(new Error('CORS no permitido por origen'), false);
    }
    return callback(null, true);
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Manejar explícitamente OPTIONS para todos los endpoints (preflight)
app.options('*', cors());
// Conectar a la base de datos
db();
// Rutas
app.use(require('./middleware/log'));
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/spaces', require('./routes/spaceRoutes'));
app.use('/api/bookings', require('./routes/bookingRoutes'));

// Manejo de errores
app.use(require('./middleware/errorHandler'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});