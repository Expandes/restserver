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

process.env.CADUCIDAD_TOKEN = '48h';


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


// =========================
// GOOGLE CLIENT ID
// =========================

process.env.CLIENT_ID = process.env.CLIENT_ID || '900133355812-1h2t3qdl0e37ck55pg1e30ha15ulnggo.apps.googleusercontent.com';