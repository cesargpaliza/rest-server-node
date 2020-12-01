const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

//librerias para verificar token google
const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENTE_ID);

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


//LOGIN POR GOOGLE
async function verify( token ) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENTE_ID,  // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    //const userid = payload['sub'];

    return {
        nombre: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    }


  }



app.post('/google', async (req, res) => {

    let token = req.body.idtoken;
    let googleUser = await verify( token )
            .catch(err => {
                return res.status(403).json({
                    ok:false,
                    err
                });
            });

    Usuario.findOne({email: googleUser.email}, (err, usuarioDB) => {
        if(err){
            return res.status(500).json({
                ok: false,
                err
            });
        };

        if(usuarioDB){
                if( usuarioDB.google === false){
                    return res.status(500).json({
                        ok: false,
                        err: {
                            message: 'Debe utilizar su autenticación normal'
                        }
                    });
                }else{
                    //Si es que se autentico con el usuario de google, se renueva el token
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
                }
        }else{
            //Si el usuario no existe en la BD debe crearse
            let usuario = new Usuario();
            usuario.nombre = googleUser.nombre;
            usuario.email = googleUser.email;
            usuario.img = googleUser.img;
            usuario.google = true; 
            usuario.password = ':)'; //se le agrega algunos caracteres para que cumpla la condicion de nuestra BD

            usuario.save( (err, usuarioDB) => {
                if(err){
                    return res.status(500).json({
                        ok: false,
                        err,
                    });
                };

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

        }
        



    });

});




module.exports = app;