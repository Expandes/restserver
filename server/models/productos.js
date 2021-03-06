var mongoose = require('mongoose');

//Unique Validator
const uniqueValidator = require('mongoose-unique-validator');


var Schema = mongoose.Schema;


var productoSchema = new Schema({
    nombre: { type: String, required: [true, 'El nombre es necesario'] },
    precioUni: { type: Number, required: [true, 'El precio únitario es necesario'] },
    descripcion: { type: String, required: false },
    disponible: { type: Boolean, required: true, default: true },
    categoria: { type: Schema.Types.ObjectId, ref: 'Categoria', required: true },
    nombreCategoria: { type: String },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario' },
    img: { type: String, required: false }
});


module.exports = mongoose.model('Producto', productoSchema);