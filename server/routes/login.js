const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario');
const app = express();

app.post('/login', (req, res) => {
    
    let body = req.body;

    //comparar el email y luego comparar la contraseña
    Usuario.findOne({email: body.email}, (err, usuarioDB) => {
        if(err){
            return res.status(500).json({
                ok: false,
                err
            });
        };

        if(!usuarioDB){
            return res.status(400).json({
                ok: false,
                err: {
                    mensaje : '-Usuario- o Contraseña incorrectos',

                }
            });
        }

        //bcrip.compareSync regresa true en caso de coincidencia
        if(! bcrypt.compareSync(body.password, usuarioDB.password)){
            return res.status(400).json({
                ok: false,
                err: {
                    mensaje : 'Usuario o -Contraseña- incorrectos',

                }
            });
        }

        //Generacion de token
        let token = jwt.sign(
            {usuario: usuarioDB,},
            process.env.SEED, //cadena de comprobacion
            {expiresIn: process.env.CADUCIDAD_TOKEN} //Expirara en 30 dias
        );

        res.json({
            ok:true,
            usuario: usuarioDB,
            token,
        })

    });
})




module.exports = app;