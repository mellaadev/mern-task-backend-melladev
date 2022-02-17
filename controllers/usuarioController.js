const Usuario = require('../models/Usuario');
const bcryptjs = require('bcryptjs');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken')

exports.crearUsuario = async (req, res) => {

    // REVISAR SI HAY ERRORES
    const errores = validationResult(req);
    if( !errores.isEmpty() ) {
        return res.status(400).json({ errores: errores.array() })
    }

    // EXTRAER EMAIL Y PASSWORD
    const { email, password } = req.body;

    try {
        // REVISAR QUE EL USUARIO REGISTRADO SEA ÚNICO
        let usuario = await Usuario.findOne({ email });

        if(usuario) {
            return res.status(400).json({ msg: 'Este EMAIL ya existe.'})
        }

        // CREA NUEVO USUARIO
        usuario = new Usuario(req.body);

        // HASHEAR EL PASSWORD
        const salt = await bcryptjs.genSalt(10);
        usuario.password = await bcryptjs.hash( password, salt )

        // GUARDAR NUEVO USUARIO
        await usuario.save();

        // CREAR Y FIRMAR EL JWT (JSONWEBTOKEN)
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
        res.status(400).send('Se ha producido un error.')
    }
}