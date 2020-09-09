const express = require('express');

const bcrypt = require('bcrypt');

const _ = require('underscore');

const Usuario = require('../models/usuario');


const app = express();

// =============================
// RUTAS SERVICIOS REST EXPRESS
// =============================

app.get('/usuario', function(req, res) {

    let desde = req.query.desde || 0;
    desde = Number(desde);


    let limite = req.query.limite || 5;
    limite = Number(limite);


    //regresar todos los que tengan el "estado:true"
    // Usuario.find({google:true})  Encontraría todos los google en true
    Usuario.find({ estado: true }, 'nombre email role estado google img')
        .skip(desde)
        .limit(limite)
        .exec((err, usuarios) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            Usuario.count({ estado: true }, (err, conteo) => {

                res.json({
                    ok: true,
                    usuarios,
                    cuantos: conteo
                })

            })



        })

    //res.json('get Usuario')
})

app.post('/usuario', function(req, res) {

    let body = req.body;

    //Creación de objeto Usuario
    let usuario = new Usuario({

        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });


    //Grabar en la base de datos

    usuario.save((err, usuarioDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }


        //Password en null, sólo para no mostrar el hash
        //usuarioDB.password = null;

        //RESPUESTA
        res.json({
            ok: true,
            usuario: usuarioDB
        })

    })

    //Rutina de prueba. Body lo señalado el el /usuario
    // if (body.nombre === undefined) {

    //     res.status(400).json({
    //         ok: false,
    //         mensaje: 'El nombre es necesario'
    //     })

    // } else {

    //     res.json({
    //         persona: body
    //     });

    // }


})



app.put('/usuario/:id', function(req, res) {

    let id = req.params.id;

    //filtrando campos que si se van a actualizar con unserscore _
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']);

    //Aquí enviamos el body entero, no se pueden hacer validaciones
    //Para que considere validaciones: runValidators:true
    //new, para que muestre al usuario lo que se escribió en la BD
    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, usuarioDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            usuario: usuarioDB
        })


    })

    // res.json({
    //     id
    // })


})



app.delete('/usuario/:id', function(req, res) {



    let id = req.params.id;

    let cambiaEstado = {
        estado: false
    }

    //Borrado real de la BD
    // Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {

    //Borrado con update del estado
    Usuario.findByIdAndUpdate(id, cambiaEstado, { new: true }, (err, usuarioBorrado) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }


        if (!usuarioBorrado) {

            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no encontrado'
                }
            });

        }

        res.json({

            ok: true,
            usuario: usuarioBorrado

        })



    })




    //res.json('delete Usuario')
})


module.exports = app;