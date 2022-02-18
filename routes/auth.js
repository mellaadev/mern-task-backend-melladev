// RUTAS PARA AUTENTICAR USUARIOS
const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const authController = require('../controllers/authController')
const auth = require('../middleware/auth')

// AUTENTICA USUARIO
// api/auth
router.post('/',
    [
        check('email', 'Agrega un email válido').isEmail(),
        check('password', 'El password debe tener como mínimo de 6 caracteres.').isLength({ min: 6 })
    ],
    authController.autenticarUsuario
);

// Obtiene el usuario autenticado
router.get('/',
    auth,
    authController.usuarioAutenticado
);

module.exports = router;