const Space = require('../models/Space');
const Booking = require('../models/Booking');
const { zonedTimeToUtc } = require('date-fns-tz');

const getSpaces = async (req, res) => {
  const { type } = req.query;
  const filter = type ? { type } : {};
  
  try {
    const spaces = await Space.find(filter);
    res.json(spaces);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener espacios' });
  }
};

const getSpaceAvailability = async (req, res) => {
  const { id, date } = req.params;
  // Offset de tu zona horaria en minutos (CDMX es -6 horas = -360 minutos)
  const offsetMinutes = 6 * 60; // Usa 5*60 si es horario de verano

  try {
    // Construye la fecha local
    const startLocal = new Date(`${date}T00:00:00`);
    const endLocal = new Date(`${date}T23:59:59.999`);

    // Convierte a UTC restando el offset
    const startUTC = new Date(startLocal.getTime() + offsetMinutes * 60000);
    const endUTC = new Date(endLocal.getTime() + offsetMinutes * 60000);

    console.log('spaceId:', id);
    console.log('startUTC:', startUTC);
    console.log('endUTC:', endUTC);

    const bookings = await Booking.find({
      space: id,
      startTime: { $gte: startUTC, $lte: endUTC },
      status: 'confirmed'
    }).populate('space').populate('user', 'name');

    res.json(bookings);
  } catch (error) {
    console.error('Error al obtener disponibilidad:', error);
    res.status(500).json({ error: 'Error al obtener disponibilidad' });
  }
};

const createSpace = async (req, res) => {
  try {
    const { name, type, capacity, location } = req.body;
    const newSpace = new Space({ name, type, capacity, location });
    await newSpace.save();
    res.status(201).json(newSpace);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear el espacio' });
  }
};

const updateSpace = async (req, res) => {
  const { spaceId } = req.params;
  const updates = req.body;

  try {
    const updatedSpace = await Space.findByIdAndUpdate
      (spaceId, updates, { new: true });
    if (!updatedSpace) {
      return res.status(404).json({ error: 'Espacio no encontrado' });
    }
    res.json(updatedSpace);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar el espacio' });
  }
};

const deleteSpace = async (req, res) => {
  try {
    const { spaceId } = req.params;
    console.log(`Eliminando espacio con ID: ${spaceId}`);
    await Booking.deleteMany({ space: spaceId });
    const deletedSpace = await Space.findByIdAndDelete(spaceId);
    if (!deletedSpace) {
      return res.status(404).json({ error: 'Espacio no encontrado' });
    }
    res.json({ message: 'Espacio y reservas asociadas eliminados correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el espacio' });
  }
};

module.exports = {
  getSpaces,
  getSpaceAvailability,
  createSpace,
  updateSpace,
  deleteSpace
};