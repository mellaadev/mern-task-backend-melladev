const Tarea = require('../models/Tarea');
const Proyecto = require('../models/Proyecto');
const { validationResult } = require('express-validator');
const { default: mongoose } = require('mongoose');

// CREA UNA NUEVA TAREA
exports.crearTarea = async (req, res) => {
    // REVISAR SI HAY ERRORES
    const errores = validationResult(req);
    if( !errores.isEmpty() ) {
        return res.status(400).json({ errores: errores.array() })
    }


    try {
        // EXTRAER EL PROYECTO Y COMPROBAR SI EXISTE
        const { proyecto } = req.body

        const existeProyecto = await Proyecto.findById(proyecto)
        if(!existeProyecto) {
            res.status(404).json({ msg: 'Proyecto no encontrado' })
        }

        // REVISAR SI EL PROYECTO ACTUAL PERTENECE AL USUARIO AUTENTICADO
        if( existeProyecto.creador.toString() !== req.usuario.id ) {
            return res.status(401).json({ msg: 'No autorizado.' });
        }

        // CREAR LA TAREA
        const tarea = new Tarea(req.body);
        await tarea.save();
        res.json({ tarea });

    } catch (error) {
        console.log(error);
        res.status(500).send('Ha ocurrido un error')
    }
}

// OBTIENE LAS TAREAS POR PROYECTI
exports.obtenerTareas = async (req, res) => {
    try {
        // EXTRAER EL PROYECTO Y COMPROBAR SI EXISTE
        const { proyecto } = req.query
        
        const existeProyecto = await Proyecto.findById(proyecto)
        if(!existeProyecto) {
            return res.status(404).json({ msg: 'Proyecto no encontrado' })
        }
        
        // REVISAR SI EL PROYECTO ACTUAL PERTENECE AL USUARIO AUTENTICADO
        if( existeProyecto.creador.toString() !== req.usuario.id ) {
            return res.status(401).json({ msg: 'No autorizado.' });
        }

        // OBTENER LAS TAREAS POR PROYECTO
        const tareas = await Tarea.find({ proyecto });
        res.json({ tareas })

    } catch (error) {
        console.log(error);
        res.status(500).send('Ha ocurrido un error')
    }
}

// ACTUALIZAR LAS TAREAS POR ID
exports.actualizarTarea = async (req, res) => {
    try {
        // EXTRAER EL PROYECTO Y COMPROBAR SI EXISTE
        const { proyecto, nombre, estado } = req.body

        // REVISAR SI LA TAREA EXISTE O NO
        let tarea = await Tarea.findById(req.params.id);

        if(!tarea) {
            return res.status(404).json({ msg: 'No existe esa tarea.' });
        }

        // EXTRAER PROYECTO
        const existeProyecto = await Proyecto.findById(proyecto)
        
        // REVISAR SI EL PROYECTO ACTUAL PERTENECE AL USUARIO AUTENTICADO
        if( existeProyecto.creador.toString() !== req.usuario.id ) {
            return res.status(401).json({ msg: 'No autorizado.' });
        }

        // CREAR UN OBJETO CON LA NUEVA INFORMACIÓN
        const nuevaTarea = {};
        nuevaTarea.nombre = nombre;
        nuevaTarea.estado = estado;

        // GUARDAR LA TAREA
        tarea = await Tarea.findOneAndUpdate( { _id : req.params.id }, nuevaTarea, { new: true } );
        res.json({ tarea })

    } catch (error) {
        console.log(error);
        res.status(500).send('Ha ocurrido un error')
    }
};

// ELIMINA UNA TAREA
exports.eliminarTarea = async (req, res) => {
    try {
        // EXTRAER EL PROYECTO Y COMPROBAR SI EXISTE
        const { proyecto } = req.query

        // REVISAR SI LA TAREA EXISTE O NO
        let tarea = await Tarea.findById(req.params.id);

        if(!tarea) {
            return res.status(404).json({ msg: 'No existe esa tarea.' });
        }

        // EXTRAER PROYECTO
        const existeProyecto = await Proyecto.findById(proyecto)
        
        // REVISAR SI EL PROYECTO ACTUAL PERTENECE AL USUARIO AUTENTICADO
        if( existeProyecto.creador.toString() !== req.usuario.id ) {
            return res.status(401).json({ msg: 'No autorizado.' });
        }

        // ELIMINAR
        await Tarea.findOneAndRemove({ _id : req.params.id });
        res.json({ msg: 'Tarea Eliminada' })

    } catch (error) {
        console.log(error);
        res.status(500).send('Ha ocurrido un error')
    }
}
