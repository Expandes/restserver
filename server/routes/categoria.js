const express = require('express');

const jwt = require('jsonwebtoken');



const _ = require('underscore');

const { verificaToken, verificaAdmin_Role } = require('../middlewares/autenticacion');


const app = express();


let Categoria = require('../models/categoria');



// =============================
// GET: Mostrar todas las categorías
// =============================

app.get('/categoria', verificaToken, (req, res) => {


    //Sin filtrar nada, trayendo todo:
    //Categoria.find({}).exec
    //POPULATE: genera link con "rel" especificado en el campo del modelo

    Categoria.find({ estado: true }, 'nombreCat descripcion estado')
        .sort('nombreCat')
        .populate('usuario', 'nombre email')
        .exec((err, categorias) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            Categoria.countDocuments({ estado: true }, (err, conteo) => {

                res.json({
                    ok: true,
                    categorias,
                    cuantos: conteo
                })

            })


        })


})



// =============================
// GET: Mostrar una categoría por ID
// =============================

app.get('/categoria/:id', verificaToken, (req, res) => {

    //categoria.findbyid
    let id = req.params.id;

    Categoria.findById(id, (err, categoriaPorId) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categoria_encontrada: categoriaPorId
        })

    })

})


// =============================
// POST: Crear nueva categoria
// =============================

app.post('/categoria', [verificaToken, verificaAdmin_Role], (req, res) => {

    //Regresa nueva categoría
    // req.usuario._id  (id de la persona que crea la nueva categoría)

    let body = req.body;

    //Creación de objeto Categoria
    let categoria = new Categoria({

        nombreCat: body.nombre,
        descripcion: body.descripcion,
        usuario: req.usuario._id
    });



    //Rutina para saber si ya existe esa categoría
    Categoria.findOne({ nombre: body.nombre }, 'nombreCat descripcion')
        .exec((err, categoriaValid) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            if (!categoriaValid) {

                //grabar nueva categoria

                categoria.save((err, categoriaDB) => {

                    if (err) {
                        return res.status(500).json({
                            ok: false,
                            err
                        });
                    }


                    //RESPUESTA
                    res.json({
                        ok: true,
                        categoria: categoriaDB,
                        id_usuario_creador: req.usuario._id
                    })

                })


            } else {
                res.json({
                    ok: true,
                    err: {
                        respuesta: 'Ya existe una categoría con ese nombre'
                    }

                })
            }


        })

})


// =============================
// PUT: Actualizar nombre de la Categoría
// =============================

app.put('/categoria/:id', [verificaToken, verificaAdmin_Role], (req, res) => {

    let id = req.params.id;

    //filtrando campos que si se van a actualizar con unserscore _
    let body = _.pick(req.body, ['nombreCat']);

    // body = {
    //     nombreCat: req.body.nombreCat
    // }

    //console.log(body);

    //Aquí enviamos el body entero, no se pueden hacer validaciones
    //Para que considere validaciones: runValidators:true
    //new, para que muestre al usuario lo que se escribió en la BD
    Categoria.findByIdAndUpdate(id, body, { new: true, runValidators: true, context: 'query' }, (err, categoriaDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoriaDB) {

            return res.status(400).json({
                ok: false,
                err
            });

        }


        res.json({
            ok: true,
            categoria_update: categoriaDB
        })


    })


})


// =============================
// DELETE: Borrar categoría
// =============================

app.delete('/categoria/:id', [verificaToken, verificaAdmin_Role], (req, res) => {

    //Sólo un administrador puede borrar categorías
    //Categoria.findbyidandremove


    let id = req.params.id;

    //Borrado real de la BD
    // Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {

    Categoria.findByIdAndRemove(id, (err, CategoriaBorrada) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }


        if (!CategoriaBorrada) {

            return res.status(400).json({
                ok: false,
                err: {
                    message: 'No existe esa categoría'
                }
            });

        }

        res.json({

            ok: true,
            Categoria_borrada: CategoriaBorrada

        })



    })


})


module.exports = app;