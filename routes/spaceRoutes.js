const express = require('express');
const router = express.Router();
const spaceController = require('../controllers/spaceController');
const admin = require('../middleware/authAdmin');

// Obtener todos los espacios o por tipo
router.get('/', spaceController.getSpaces);

// Obtener disponibilidad de un espacio por fecha
router.get('/:id/availability/:date', spaceController.getSpaceAvailability);

// Crear un nuevo espacio
router.post('/', admin, spaceController.createSpace);
// Actualizar un espacio
router.put('/:spaceId', admin, spaceController.updateSpace);
// Eliminar un espacio
router.delete('/:spaceId', admin, spaceController.deleteSpace);

module.exports = router;