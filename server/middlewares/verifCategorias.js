// =============================
// Verificar CATEGORIA
// =============================

let Categoria = require('../models/categoria');



let verificaCategoria = (req, res, next) => {

    let categoriaNombre = req.body.categoria;

    Categoria.findOne(({ nombreCat: categoriaNombre }), (err, resultado) => {


        if (err) {
            return res.status(500).json({
                ok: false,
                err: {
                    respuesta: 'Ocurrió un error'
                }
            });
        }



        if (!resultado) {

            return res.status(500).json({
                ok: false,
                err: {
                    respuesta: 'No se encontró la categoría indicada, favor de crearla'
                }
            });

        } else {

            let categoria = {
                resultado
            }
            req.categoriaId = categoria.resultado._id;
            next();

        }

        //console.log(categoria.resultado._id);

    })


}




// =============================
// Verificar PRODUCTO
// =============================

let Producto = require('../models/productos');



let verificaProducto = (req, res, next) => {

    let productoNombre = req.body.nombre;

    Producto.findOne(({ nombre: productoNombre }), (err, resultado) => {


        if (err) {
            return res.status(500).json({
                ok: false,
                err: {
                    respuesta: 'Ocurrió un error'
                }
            });
        }



        if (resultado) {

            return res.status(500).json({
                ok: false,
                err: {
                    respuesta: 'Se encontró un producto con nombre similar, favor de poner otro nombre'
                }
            });

        } else {

            next();

        }


    })


}



module.exports = {

    verificaCategoria,
    verificaProducto

}



//module.exports.verificaCategoria;