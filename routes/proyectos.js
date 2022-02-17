const express = require('express')
const router = express.Router();
const proyectoController = require('../controllers/proyectoController');
const auth = require('../middleware/auth');
const { check } = require('express-validator');

// CREA PROYECTOS
// api/proyectos
router.post('/',
    auth,
    [
        check('nombre', 'El nombre del Proyecto es obligatorio').not().isEmpty()
    ],
    proyectoController.crearProyecto
)

// OBTENER TODOS LOS PROYECTOS
router.get('/',
    auth,
    proyectoController.obtenerProyectos
)

// ACTUALIZAR PROYECTO VIA ID
router.put('/:id',
    auth,
    [
        check('nombre', 'El nombre del Proyecto es obligatorio').not().isEmpty()
    ],
    proyectoController.actualizarProyecto
);

// ELIMINAR UN PROYECTO VIA ID
router.delete('/:id',
    auth,
    proyectoController.eliminarProyecto
);

module.exports = router