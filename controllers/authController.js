const Usuario = require('../models/Usuario');
const bcryptjs = require('bcryptjs');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken')

exports.autenticarUsuario = async (req, res) => {
    // REVISAR SI HAY ERRORES
    const errores = validationResult(req);
    if( !errores.isEmpty() ) {
        return res.status(400).json({ errores: errores.array() })
    }

    // EXTRAER EL EMAIL Y PASSWORD DEL req
    const { email, password } = req.body;

    try {
        // REVISAR QUE SEA UN USUARIO REGISTRADO    
        let usuario = await Usuario.findOne({ email })

        if(!usuario) {
            return res.status(400).json({ msg: 'El usuario no existe.' })
        }

        // REVISAR EL PASSWORD
        const passCorrecto = await bcryptjs.compare(password, usuario.password)
        if(!passCorrecto) {
            return res.status(400).json({ msg: 'El Password es incorrecto.' })
        }

        // SI TODO ES CORRECTO CREAMOS EL JWT CREAR Y FIRMAR EL JWT (JSONWEBTOKEN)
        const payload = {
            usuario: {
                id: usuario.id
            }
        };

        // FIRMAR EL TOKEN
        jwt.sign(payload, process.env.SECRETA, {
            expiresIn: 3600 // 1 HORA
        }, (error, token) => {
            if(error) throw error;

            // MENSAJE DE CONFIRMACIÓN
            res.json({ token })
        });

    } catch (error) {
        console.log(error);
    }
}