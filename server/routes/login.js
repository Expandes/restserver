const express = require('express');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

//Google Auth
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);
//===========


const Usuario = require('../models/usuario');
const { response } = require('./usuario');

const app = express();


// =========================
// LOGIN
// =========================


app.post('/login', (req, res) => {

    let body = req.body;

    //Chequea que exista el email en la base de datos
    Usuario.findOne({ email: body.email }, (err, usuarioDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!usuarioDB) {

            return res.status(400).json({
                ok: false,
                err: {
                    message: '(Usuario) o Contraseña incorrectos'
                }
            });

        }

        //Comparación de cadena encriptada para validar password
        if (!bcrypt.compareSync(body.password, usuarioDB.password)) {

            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario o (Contraseña) incorrectos'
                }
            });


        }

        //Creación del token
        //Payload - semilla - expiración
        let tokenX = jwt.sign({ usuario: usuarioDB }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });

        res.json({

            ok: true,
            usuario: usuarioDB,
            token: tokenX

        });

    })


})



// =========================
// Configuraciones de Google (función para validar token)
// =========================

async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    //const userid = payload['sub'];

    // console.log(payload.name);
    // console.log(payload.email);
    // console.log(payload.picture);

    return {

        nombre: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true

    }


}



// =========================
// GOOGLE AUTH - Recibiendo Google Info
// =========================


app.post('/google', async(req, res) => {

    let token = req.body.idtoken;

    let googleUser = await verify(token)
        .catch(e => {

            return res.status(403).json({
                ok: false,
                err: e
            });

        });



    // res.json({
    //     usuario: googleUser
    // });


    //Búsqueda en BD en campo email
    Usuario.findOne({ email: googleUser.email }, (err, usuarioDB) => {


        //En caso de error en la búsqueda
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        //Si el usuario existe en la base de datos
        if (usuarioDB) {

            //Si el usuario no se ha registrado con Google Auth
            if (usuarioDB.google === false) {

                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'Debe de usar la autenticación normal'
                    }
                });

            } else {

                //Si el usuario si se ha registrado con Google Auth
                //Creamos el token personalizado del sitio propio
                let tokenX = jwt.sign({
                    usuario: usuarioDB
                }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });

                return res.json({
                    ok: true,
                    usuario: usuarioDB,
                    token
                })

            }
        } else {

            //Si el usuario no existe en la base de datos
            let usuario = new Usuario();

            usuario.nombre = googleUser.nombre;
            usuario.email = googleUser.email;
            usuario.img = googleUser.img;
            usuario.google = true;
            usuario.password = ':)';

            usuario.save((err, usuarioDB) => {

                if (err) {
                    return res.status(500).json({
                        ok: false,
                        err
                    });
                }


                let tokenX = jwt.sign({
                    usuario: usuarioDB
                }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });

                return res.json({
                    ok: true,
                    usuario: usuarioDB,
                    tokenX
                })


            });

        }


    });

});

module.exports = app;