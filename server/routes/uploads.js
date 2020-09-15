const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();

const Usuario = require('../models/usuario');
const Producto = require('../models/productos');

const fs = require('fs');
const path = require('path');


// default options
app.use(fileUpload());


app.put('/upload/:tipo/:id', function(req, res) {

    let tipo = req.params.tipo;
    let id = req.params.id;



    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400)
            .json({
                ok: false,
                err: {
                    message: 'No se ha seleccionado ningún archivo'
                }
            })

    };


    //Validar TIPO:

    let tiposValidos = ['productos', 'usuarios'];

    if (tiposValidos.indexOf(tipo) < 0) {

        return res.status(400).json({
            ok: false,
            err: {
                message: 'Los tipos permitidos son ' + tiposValidos.join(', ')
            }


        });
    }

    // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
    //body de FORM DATA archivo:
    let archivo = req.files.archivo;

    //Extensiones de archivo autorizadas
    let nombreCortado = archivo.name.split('.');
    let extension = nombreCortado[nombreCortado.length - 1];

    let extensionesValidas = ['png', 'jpg', 'jpeg', 'gif'];

    //Retorna -1 si no está
    if (extensionesValidas.indexOf(extension) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Las extensiones permitidas son ' + extensionesValidas.join(', '),
                ext: extension
            }

        })


    }

    //Cambiar nombre al archivo
    let nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extension}`;


    // Use the mv() method to place the file somewhere on your server
    archivo.mv(`uploads/${tipo}/${nombreArchivo}`, function(err) {
        if (err)
            return res.status(500).json({
                ok: false,
                err
            });

        //Aquí la imagen es cargada

        if (tipo === 'usuarios') {

            imagenUsuario(id, res, nombreArchivo);

        } else {

            imagenProducto(id, res, nombreArchivo);
        }


        // res.json({
        //     ok: true,
        //     message: 'imagen subida correctamente'
        // });
    });


});



function imagenUsuario(id, res, nombreArchivo) {

    Usuario.findById(id, (err, usuarioBD) => {

        if (err) {
            //Si hay error, borrar archivo
            borraArchivo(nombreArchivo, 'usuarios');
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!usuarioBD) {
            //Si el usuario no existe, borrar la imagen que se subio
            borraArchivo(nombreArchivo, 'usuarios');
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no existe'
                }
            })

        }



        //Verificar que exista el archivo con la información proporcionada en la BD
        //Si existe, lo borra, reemplaza todo.

        // pathImagen = path.resolve(__dirname, `../../uploads/usuarios/${usuarioBD.img}`);

        // if (fs.existsSync(pathImagen)) {
        //     fs.unlinkSync(pathImagen);
        // }

        borraArchivo(usuarioBD.img, 'usuarios')


        //Reinicia el proceso de grabado

        usuarioBD.img = nombreArchivo;
        usuarioBD.save((err, usuarioGuardado) => {

            res.json({
                ok: true,
                usuario: usuarioGuardado,
                img: nombreArchivo
            })

        })


    })

}


function imagenProducto(id, res, nombreArchivo) {

    Producto.findById(id, (err, productosBD) => {

        if (err) {
            //Si hay error, borrar archivo
            borraArchivo(nombreArchivo, 'productos');
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!productosBD) {
            //Si el usuario no existe, borrar la imagen que se subio
            borraArchivo(nombreArchivo, 'productos');
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Producto no existe'
                }
            })

        }


        borraArchivo(productosBD.img, 'productos')


        //Reinicia el proceso de grabado

        productosBD.img = nombreArchivo;
        productosBD.save((err, productoGuardado) => {

            res.json({
                ok: true,
                producto: productoGuardado,
                img: nombreArchivo
            })

        })


    })

}



function borraArchivo(nombreImagen, tipo) {

    //Verificar que exista el archivo con la información proporcionada en la BD
    //Si existe, lo borra, reemplaza todo.

    pathImagen = path.resolve(__dirname, `../../uploads/${tipo}/${nombreImagen}`);

    if (fs.existsSync(pathImagen)) {
        fs.unlinkSync(pathImagen);
    }

}



module.exports = app;