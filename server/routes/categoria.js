const express = require('express');
const app = express();
const Categoria = require('../models/categoria');
let { verificarToken, verificarAdminRol } = require('../middlewares/autenticacion');


app.get('/categoria', verificarToken, (req, res) => {
    Categoria.find({})
    .sort('descripcion')
    .populate('usuario', 'nombre email')
    .exec((err, categorias) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            categorias
        });
    })
});

app.get('/categoria/:id', verificarToken, (req, res) => {
    
    const id = req.params.id;

    Categoria.findById(id, (err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if(!categoriaDB) {
            return res.status(500).json({
                ok: false,
                err: {
                    message: 'El ID no es correcto'
                }
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });


    });
   
});

app.post('/categoria', verificarToken, (req, res) => { 
    let body = req.body;

    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id,
    })

    categoria.save( (err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if(! categoriaDB ) {
            return res.status(500).json({
                ok: false,
                err
            });
        }else{
            res.json({
                ok: true,
                categoria: categoriaDB,
            })
        }
    });
});

app.put('/categoria/:id', verificarToken, (req, res) => {
    
    let id = req.params.id;
    let body = req.body;

    let descCategoria = {
        descripcion: body.descripcion,
    };

    const options = {
        new: true,           //configura retornar el registro actualizado
        runValidators: true  //corra las validaciones definidas al declarar doc
    }


    Categoria.findByIdAndUpdate(id, descCategoria, options, (err, categoriaDB) => {
        if(err){
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            usuario: categoriaDB,
        });
    })


});

app.delete('/categoria/:id', [verificarToken, verificarAdminRol], (req, res) => {
    let id = req.params.id;
    
    Categoria.findByIdAndRemove(id, (err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
    
        if(! categoriaDB ) {
            return res.status(500).json({
                ok: false,
                err: {
                    message: 'El id no existe'
                }
            });
        }
        res.json({
            ok: true,
            message: "Categoria borrada",
        })
    });
    
    
    
});

module.exports = app;