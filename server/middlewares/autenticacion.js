const jwt = require('jsonwebtoken');

//=====================================
//Verifica token
//=====================================

//El next continua con la ejecución del programa
let verificaToken = (req, res, next) => {

    let token = req.get('Authorization'); //Toma el header que tiene asignado, en mi caso guardo el token en authorization pero podría llamarse de otra manera 

    jwt.verify(token, process.env.SEED, (err, decoded) => { //decode tiene todo el payload
        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Token no valido'
                }
            })
        }

        req.usuario = decoded.usuario; //asignamos un nuevo campo usuario al req
        next();
    })
};

//=====================================
//Verifica token por query
//=====================================

let verificaTokenImg = (req, res, next) => {

    let token = req.query.authorization; //Toma el header que tiene asignado, en mi caso guardo el token en authorization pero podría llamarse de otra manera 

    jwt.verify(token, process.env.SEED, (err, decoded) => { //decode tiene todo el payload
        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Token no valido'
                }
            })
        }

        req.usuario = decoded.usuario; //asignamos un nuevo campo usuario al req
        next();
    })
};



//=====================================
//Verifica admin role
//=====================================

let verificaAdminRole = (req, res, next) => {
    let role = req.usuario.role;
    console.log(req.usuario)
    if (!(role === 'ADMIN_ROLE')) {
        return res.status(401).json({
            ok: false,
            err: {
                message: 'El usuario no tiene permitido realizar la operación'
            }
        })
    }
    next();
}

module.exports = {
    verificaToken,
    verificaTokenImg,
    verificaAdminRole
}