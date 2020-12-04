const express = require('express');
const fileUpload = require('express-fileupload');
const usuario = require('../models/usuario');
const app = express();
const fs = require('fs');
const path = require('path');

const Usuario = require('../models/usuario');
const Producto = require('../models/producto');

app.use(fileUpload({
    limits: { fileSize: 50 * 1024 * 1024 },
  }));


//APP PUT
app.put('/upload/:tipo/:id', function(req, res) {

    let tipo = req.params.tipo;
    let id = req.params.id;

    
    if(! req.files){
        return res.status(400)
            .json({
                ok: false,
                err: {
                    message: 'No se ha subido ningun archivo'
                }
            });        
    }

    //Validacion de tipo de entidad en url asociada a la imagen
    let tiposValidos = ['producto','usuario'];
    if(tiposValidos.indexOf(tipo) < 0){
        return res.status(400).json({
            ok: false,
            err: {
                message: `No es un tipo permitido` 
            }
        })
    }

    //Validacion de extension de archivo
    let archivo = req.files.archivo;
    let nombreArchivoCortado = archivo.name.split('.');
    let extensionArchivo = nombreArchivoCortado[nombreArchivoCortado.length - 1];
    let extensionesValidas = ['png', 'jpg'];
    if(extensionesValidas.indexOf(extensionArchivo) < 0){
        return res.status(400).json({
            ok: false,
            err: {
                message: `Las extensiones permitidas son: ${extensionesValidas.join(', ')}` 
            }
        })
    }

    //Cambiar Nombre de Archivo
    let nombreArchivoGenerado = `${id}-${new Date().getMilliseconds()}.${ extensionArchivo}`;

    archivo.mv(`uploads/${tipo}/${nombreArchivoGenerado}`, function(err) {
        if (err){
            return res.status(400)
            .json({
                ok: false,
                err
            });
        }

        //subir archivo a la carpeta usuario o producto
        if(tipo === 'usuario'){
            imagenUsuario(id,res,nombreArchivoGenerado); 
        }else{
            imagenProducto(id,res,nombreArchivoGenerado); 
        }


      });

});

function imagenUsuario(id, res, nombreArchivo) {
    Usuario.findById(id, (err, usuarioDB) => {
        if(err){
            borrarArchivo(nombreArchivo , 'usuario');
            return res.status(500).json({
                ok : false,
                err
            })
        }

        if(!usuarioDB){
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no existe'
                }
            })
        }

        borrarArchivo(usuarioDB.img , 'usuario');

        usuarioDB.img = nombreArchivo;
        usuarioDB.save( (err, usuarioGuardado) => {
              res.json({
                ok:true,
                usuario: usuarioGuardado,
                img: nombreArchivo
            })
        });

    });
}




function borrarArchivo(nombreImagen, tipo) {
    let pathImagen = path.resolve(__dirname, `../../uploads/${tipo}/${nombreImagen}`);
    if(fs.existsSync(pathImagen)){
        fs.unlinkSync(pathImagen);
    }
}


////IMAGEN EN PRODUCTO
function imagenProducto(id, res, nombreArchivo) {
    Producto.findById(id, (err, productoDB) => {
        if(err){
            borrarArchivo(nombreArchivo , 'producto');
            return res.status(500).json({
                ok : false,
                err
            })
        }

        if(!productoDB){
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Producto no existe'
                }
            })
        }

        borrarArchivo(productoDB.img , 'producto');

        productoDB.img = nombreArchivo;
        productoDB.save( (err, productoGuardado) => {
              res.json({
                ok:true,
                usuario: productoGuardado,
                img: nombreArchivo
            })
        });

    });
    
}


module.exports = app;