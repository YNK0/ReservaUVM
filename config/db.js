const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../models/User');

async function createDefaultAdmin() {
  const adminEmail = 'admin@admin.com';
  const adminExists = await User.findOne({ email: adminEmail });
  if (!adminExists) {
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await User.create({
      name: 'Administrador',
      email: adminEmail,
      password: hashedPassword,
      role: 'admin'
    });
    console.log('Usuario admin creado: admin@admin.com / admin123');
  }
}

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB conectado');
    await createDefaultAdmin();
    console.log('Verificación de usuario admin completada');
  } catch (error) {
    console.error('Error al conectar a MongoDB:', error);
    process.exit(1);
  }
};

module.exports = connectDB;