const jwt = require('jsonwebtoken');

let verificarToken = (req, res, next) => {
    //obtener el header token
    let token = req.get('token');
    
    jwt.verify(token, process.env.SEED , (err, decoded) => {

        if(err) {
            return res.status(401).json({
                ok: false,
                err
            })
        }

        req.usuario = decoded.usuario;
        next();

    });
};

let verificarAdminRol = (req, res, next) => {
    //obtener el header token
    
    let usuario = req.usuario;

    if(usuario.role === 'ADMIN_ROLE'){
        next();
    }else{
        return res.json({
            ok: false,
            err: {
                message: 'El usuario no es Administrador'
            },
            role: usuario.role
        });
    }
};


module.exports = {
    verificarToken,
    verificarAdminRol,
}