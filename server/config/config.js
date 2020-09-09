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
// BASE DE DATOS
// =========================

let urlDB;

if (process.env.NODE_ENV === 'dev') {

    urlDB = 'mongodb://localhost:27017/cafe';

} else {

    urlDB = 'mongodb+srv://usuario:a7tf2tQ6jybVi1K1@cluster0.w8fks.gcp.mongodb.net/cafe?retryWrites=true&w=majority';

}


//urlDB = 'mongodb+srv://usuario:a7tf2tQ6jybVi1K1@cluster0.w8fks.gcp.mongodb.net/cafe?retryWrites=true&w=majority';

process.env.URLBASEDEDATOS = urlDB;