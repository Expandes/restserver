// =============================
// Verificar Token
// =============================

const jwt = require('jsonwebtoken');


let verificaToken = (req, res, next) => {

    //De los headers
    let token = req.get('token');


    //Verificando con jwt. Decoded es el payload decodificado
    jwt.verify(token, process.env.SEED, (err, decoded) => {

        if (err) {
            return res.status(401).json({

                ok: false,
                err: {
                    message: 'Token no válido'
                }

            })
        }

        req.usuario = decoded.usuario;


        next();


    })

    //console.log(token);

    // res.json({

    //     token: token

    // });

};


// =============================
// Verificar ADMINISTRADOR
// =============================

let verificaAdmin_Role = (req, res, next) => {

    let usuario = req.usuario;

    if (usuario.role === 'ADMIN_ROLE') {

        next();

    } else {

        return res.json({

            ok: false,
            err: {
                message: 'El usuario no es administrador'

            }

        });

    }


}





// =============================
// Verificar token para imagen
// =============================

let verificaTokenImg = (req, res, next) => {

    //De los querys o ? en el url
    let token = req.query.token;

    //Verificando con jwt. Decoded es el payload decodificado
    jwt.verify(token, process.env.SEED, (err, decoded) => {

        if (err) {
            return res.status(401).json({

                ok: false,
                err: {
                    message: 'Token no válido'
                }

            })
        }

        req.usuario = decoded.usuario;


        next();


    })
}










module.exports = {

    verificaToken,
    verificaAdmin_Role,
    verificaTokenImg

}


//Otro modo:
//module.exports.verificaToken