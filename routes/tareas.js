const express = require('express')
const router = express.Router();
const tareaController = require('../controllers/tareaController');
const auth = require('../middleware/auth');
const { check } = require('express-validator');

// CREAR UNA TAREA
// api/tareas
router.post('/',
    auth,
    [
        check('nombre', 'El Nombre es obligatorio.').not().isEmpty(),
        check('proyecto', 'El proyecto es obligatorio.').not().isEmpty(),
    ],
    tareaController.crearTarea
);

// OBTENER LAS TAREAS POR PROYECTO
router.get('/',
    auth,
    tareaController.obtenerTareas
);

// ACTUALIZAR LA TAREA
router.put('/:id',
    auth,
    tareaController.actualizarTarea
);

// ELIMINAR TAREA
router.delete('/:id',
    auth,
    tareaController.eliminarTarea
)

module.exports = router;