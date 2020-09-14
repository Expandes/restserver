//Mongoose
const mongoose = require('mongoose');

//Unique Validator
const uniqueValidator = require('mongoose-unique-validator');

//Esquema
let Schema2 = mongoose.Schema;


// =====================================
// ESQUEMA USUARIO
// =====================================

let categoriaSchema = new Schema2({


    nombreCat: {

        type: String,
        unique: true,
        required: [true, 'El nombre de categoría es necesario']

    },

    descripcion: {

        type: String

    },

    estado: {
        type: Boolean,
        default: true
    },

    usuario: {
        type: String,
        ref: 'Usuario'
    }



});


//Unique validator te brinda un filtro y estructura de errores de cada uno de los elementos del schema
//Set del Plugin Unique Validator, previamente es necesario agregar: unique:true. 
//mensaje: Path (email) debe ser único
categoriaSchema.plugin(uniqueValidator, { message: '{PATH} debe existir sólo un nombre de categoría' });

//Exportación
module.exports = mongoose.model('Categoria', categoriaSchema);