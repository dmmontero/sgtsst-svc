const jwt = require('jsonwebtoken');

/**
 * Verificar el token de Usuario
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
let verificaToken = (req, res, next) => {

    let token = req.get('token');

    jwt.verify(token, process.env.SEED, (err, decoded) => {

        if (err) {
            return res.status(401).json({
                ok: false,
                error: {
                    mensaje: 'Token no válido',
                    err
                }
            })
        }

        //decode contiene el token decodificado
        req.usuario = decoded.usuario;
        next();

    });
}

/**
 * Verifica que usuario tenga el role de Administrador (ADMIN_ROLE)
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
let verificaAdminRole = (req, res, next) => {

    let usuario = req.usuario;
    if (usuario && usuario.role === 'ADMIN_ROLE') {
        next();
        return
    }

    return res.status(401).json({
        ok: false,
        err: {
            message: 'Operación no válida'
        }
    });

}

module.exports = {
    verificaToken,
    verificaAdminRole
};