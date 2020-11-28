const express = require('express');
const Usuario = require('../models/usuario');

const app = express();
const bcrypt = require('bcrypt');
const _ = require('underscore');


app.get('/usuario', function (req, res) {
    
    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);

    Usuario.find({estado: true}, 'nombre email')
            .skip(desde)
            .limit(limite)
            .exec( (err, usuarios) => {
                if(err){
                    return res.status(400).json({
                        ok: false,
                        err
                    })
                }

                res.json({
                    ok: true,
                    usuarios,
                    //cantidad
                })

                Usuario.count({estado: true}, (err, cantidad) => {
                    if(err){
                        return res.status(400).json({
                            ok: false,
                            mensaje: "error en count",
                            err
                        })
                    }                    
                    res.json({
                        ok: true,
                        usuarios,
                        cantidad
                    })
                } )
            })


});

app.post('/usuario', function (req, res) {

    let body = req.body;

    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role,
    })

    usuario.save((err, usuarioDB) => {  
        
        if(err){
            return res.status(400).json({
                ok: false,
                err
            })
        }
        //usuarioDB.password = null; //si quiero que la respuesta mande null algun campo
        res.json({
            ok: true,
            usuario: usuarioDB,
        })
    });
});

app.put('/usuario/:id', function (req, res) {

    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']);

    const options = {
        new: true,           //configura retornar el registro actualizado
        runValidators: true  //corra las validaciones definidas al declarar doc
    }
    //Usuario es definido en el modelo (models/usuario.js)
    Usuario.findByIdAndUpdate(id, body, options, (err, usuarioDB) => {
        if(err){
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            usuario: usuarioDB,
        });
    })

    
});

app.delete('/usuario/:id', function (req, res) {
    
    let id = req.params.id;

    let cambiarEstado = {
        estado: false
    };


    Usuario.findByIdAndUpdate(id, cambiarEstado, {new: true}, (err, usuarioDB) => {
        if(err){
            return res.status(400).json({
                ok: false,
                err
            });
        }
        if(usuarioDB === null){
            return res.status(400).json({
                ok: false,
                err: "Usuario borrado"
            });
        }
        res.json({
            ok: true,
            usuario: usuarioDB,
        })
    });




    //BORRADO FISICO
    // Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {
    //     if(err){
    //         return res.status(400).json({
    //             ok: false,
    //             err
    //         });
    //     }
    //     if(usuarioBorrado === null){
    //         return res.status(400).json({
    //             ok: false,
    //             err: "Usuario borrado"
    //         });
    //     }
    //     res.json({
    //         ok: true,
    //         usuario: usuarioBorrado,
    //     })
    // });

});

module.exports = app;