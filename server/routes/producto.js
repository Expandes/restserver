const express = require('express');
const autenticacion = require('../middlewares/autenticacion');

//const _ = require('underscore');

const { verificaToken, verificaAdmin_Role } = require('../middlewares/autenticacion');
const { verificaCategoria, verificaProducto } = require('../middlewares/verifCategorias');

const app = express();


let Producto = require('../models/productos');


// =========================
// Obtener productos
// =========================


app.get('/productos', [verificaToken, verificaAdmin_Role], (req, res) => {
    // trae todos los productos
    // populate: usuario y categoria
    // Paginado

    let desde = req.query.desde || 0;
    desde = Number(desde);

    Producto.find({ disponible: true })
        .sort('nombre')
        .skip(desde)
        .limit(5)
        .populate('usuario', '_id nombre email')
        .populate('categoria', '_id nombreCat')
        .exec((err, productos) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            Producto.countDocuments({}, (err, conteo) => {

                res.json({
                    ok: true,
                    productos,
                    cuantos: conteo
                })

            })


        })

});

// =========================
// Obtener un producto por ID
// =========================


app.get('/productos/:id', [verificaToken, verificaAdmin_Role], (req, res) => {

    // populate: usuario y categoria
    let id = req.params.id;

    Producto.find({ _id: id, disponible: true })
        .populate('usuario', '_id nombre email')
        .populate('categoria', '_id nombreCat')
        .exec((err, productos) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            if (!productos) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'ID no existe'
                    }
                });

            }

            res.json({
                ok: true,
                productos,

            })

        })

});

// =========================
// Buscar productos
// =========================

app.get('/productos/buscar/:termino', [verificaToken, verificaAdmin_Role], (req, res) => {

    let termino = req.params.termino;

    //Creando expresión regular con i - insensible a mayos y minus

    let regex = new RegExp(termino, 'i');


    Producto.find({ nombre: regex })
        .populate('categoria', 'nombreCat')
        .exec((err, productos) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                productos
            })

        })

})




// =========================
// Crear un nuevo producto
// =========================


app.post('/productos', [verificaToken, verificaAdmin_Role, verificaCategoria, verificaProducto], (req, res) => {

    // Grabar usuario
    // Grabar categoria del listado de categorias

    let body = req.body;

    //Creación de objeto Categoria
    let producto = new Producto({

        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        categoria: req.categoriaId,
        nombreCategoria: body.categoria,
        usuario: req.usuario._id

    });


    producto.save((err, productoDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }


        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err
            });

        }

        //Respuesta producto grabado
        res.json({
            ok: true,
            producto: productoDB,
            id_usuario_creador: req.usuario._id
        })

    })


});


// =========================
// Actualizar un nuevo producto
// =========================


app.put('/productos/:id', [verificaToken, verificaAdmin_Role], (req, res) => {

    // Grabar usuario
    // Grabar categoria del listado de categorias

    let id = req.params.id;

    //filtrando campos que si se van a actualizar con unserscore _
    let body = req.body;


    //Aquí enviamos el body entero, no se pueden hacer validaciones
    //Para que considere validaciones: runValidators:true
    //new, para que muestre al usuario lo que se escribió en la BD
    Producto.findById(id, (err, productoDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoDB) {

            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El ID de producto a modificar, no existe'
                }
            });

        }

        productoDB.nombre = body.nombre;
        productoDB.precioUni = body.precioUni;
        productoDB.categoria = body.categoria;
        productoDB.disponible = body.disponible;
        productoDB.descripcion = body.descripcion;

        productoDB.save((err, productoGuardado) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                producto: productoGuardado
            });

        });



    })




});



// =========================
// Borrar un producto
// =========================


app.delete('/productos/:id', [verificaToken, verificaToken], (req, res) => {

    // Grabar usuario
    // Grabar categoria del listado de categorias
    //Disponible a falso

    let id = req.params.id;

    Producto.findById(id, (err, productoDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'ID no existe'
                }
            });
        }

        productoDB.disponible = false;

        productoDB.save((err, productoBorrado) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                productoBorrado,
                mensaje: 'Producto borrado'
            });

        });


    })


});


module.exports = app;