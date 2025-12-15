const express = require('express');
const router = express.Router();
const tareasController = require('../controllers/tareasController');

// GET - Obtener todas las tareas
router.get('/', tareasController.obtenerTareas);

// GET - Obtener una tarea por ID
router.get('/:id', tareasController.obtenerTareaPorId);

// POST - Crear nueva tarea
router.post('/', tareasController.crearTarea);

// PUT - Actualizar tarea
router.put('/:id', tareasController.actualizarTarea);

// DELETE - Eliminar tarea
router.delete('/:id', tareasController.eliminarTarea);

module.exports = router;
