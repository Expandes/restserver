//Configuraciones GLOBALES

// =========================
// PUERTO
// =========================

process.env.PORT = process.env.PORT || 3000;



// =========================
// ENTORNO 
// =========================

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';


// =========================
// Vencimiento del token
// =========================

process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30;


// =========================
// SEED Semilla de autenticación
// =========================


process.env.SEED = process.env.SEED || 'seed-javier'



// =========================
// BASE DE DATOS
// =========================

let urlDB;

if (process.env.NODE_ENV === 'dev') {

    urlDB = 'mongodb://localhost:27017/cafe';

} else {

    urlDB = process.env.MONGO_URL;

}



process.env.URLBASEDEDATOS = urlDB;