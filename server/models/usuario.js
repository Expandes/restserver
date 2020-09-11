//Mongoose
const mongoose = require('mongoose');

//Unique Validator
const uniqueValidator = require('mongoose-unique-validator');


//Esquema
let Schema = mongoose.Schema;

//Roles válidos

let rolesValidos = {

    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un rol válido'

};


// =====================================
// ESQUEMA USUARIO
// =====================================

let usuarioSchema = new Schema({


    nombre: {

        type: String,
        required: [true, 'El nombre es necesario']

    },
    email: {

        type: String,
        unique: true,
        required: [true, 'El correo es necesario']

    },
    password: {

        type: String,
        required: [true, 'La contraseña es obligatoria']

    },
    img: {

        type: String,
        required: [false]

    },
    role: {
        type: String,
        default: 'USER_ROLE',
        enum: rolesValidos
            //enum lista los roles válidos
    },
    estado: {

        type: Boolean,
        default: true

    },
    google: {

        type: Boolean,
        default: false

    }


});


//No mostrar password

usuarioSchema.methods.toJSON = function() {

    let user = this;
    let userObject = user.toObject();
    delete userObject.password;

    return userObject;

}

//Unique validator te brinda un filtro y estructura de errores de cada uno de los elementos del schema
//Set del Plugin Unique Validator, previamente es necesario agregar: unique:true. 
//mensaje: Path (email) debe ser único
usuarioSchema.plugin(uniqueValidator, { message: '{PATH} debe de ser único' });

//Exportación
module.exports = mongoose.model('Usuario', usuarioSchema);