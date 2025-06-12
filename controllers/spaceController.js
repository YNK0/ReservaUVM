const Space = require('../models/Space');
const Booking = require('../models/Booking');

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
  const { spaceId, date } = req.params;
  
  try {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);
    
    const bookings = await Booking.find({
      space: spaceId,
      startTime: { $gte: startOfDay, $lte: endOfDay },
      status: 'confirmed'
    });
    
    res.json(bookings);
  } catch (error) {
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
  const { spaceId } = req.params;

  try {
    const deletedSpace = await Space.find
      ByIdAndDelete(spaceId);
    if (!deletedSpace) {
      return res.status(404).json({ error: 'Espacio no encontrado' });
    }
    res.json({ message: 'Espacio eliminado correctamente' });
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