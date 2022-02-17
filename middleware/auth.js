const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
    // LEER EL TOKEN DEL HEADER 
    const token = req.header('x-auth-token');

    // REVISAR SI NO HAY TOKEN
    if(!token) {
        return res.status(401).json({ msg: 'No hay token, permiso no autorizado. '})
    }

    // VALIDAR EL TOKEN
    try {
        const cifrado = jwt.verify(token, process.env.SECRETA);
        req.usuario = cifrado.usuario;
        next()
    } catch (error) {
        res.status(401).json({ msg: 'Token no válido' })
    }

}