// =========================
// REQUIREMENTS
// =========================

//Configuraciones Globales
require('./config/config');

//Express
const express = require('express');
//Mongoose
const mongoose = require('mongoose');
//Path
const path = require('path');

const app = express();



// =========================
// BODY PARSER
// =========================

const bodyParser = require('body-parser');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())


// =========================
// Habilitar el PUBLIC/
// =========================

app.use(express.static(path.resolve(__dirname, '../public')));


// =========================
// RUTAS SERVICIOS REST EXPRESS (require)
// Configuración Global de Rutas
// =========================

app.use(require('./routes/index.js'));



// =========================
// CONEXIÓN A BASE DE DATOS EN EL PUERTO 27017
// =========================

mongoose.connect(process.env.URLBASEDEDATOS, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true },

    (err, res) => {

        if (err) throw err;

        console.log('Base de datos online');

    });


// =========================
// LISTENER DEL PUERTO DE SERVIDOR WEB
// =========================


app.listen(process.env.PORT, () => {

    console.log("Escuchando puerto: ", process.env.PORT);

})