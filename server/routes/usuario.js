const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const _ = require('underscore');

const Usuario = require('./../models/usuarios');
const { verificaToken, verificaAdminRole } = require('../middlewares/autenticacion');

app.get('/usuarios', verificaToken, (req, res) => {
    console.log(req.usuario);

    let desde = req.query.desde || 0;
    desde = Number(desde);
    let limite = req.query.limite || 5;
    limite = Number(limite); //lo convierte a numero 

    const estadoActivo = { estado: true }
        //Exec => Ejecuta el find

    Usuario.find(estadoActivo, 'nombre email estado google')
        .skip(desde) //Se salta los primeros 5
        .limit(limite) //Limita a 5 registros
        .exec((err, usuarios) => {
            if (err) {
                res.status(400).json({
                    ok: false,
                    err
                })
                return;
            }

            Usuario.count(estadoActivo, (cantErr, cant) => {
                res.status(200).json({
                    ok: true,
                    usuarios,
                    cant
                })
            })


        })
})

app.post('/usuarios', [verificaToken, verificaAdminRole], (req, res) => {
    let body = req.body;
    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });

    usuario.save((err, resUsuario) => {
        if (err) {
            res.status(400).json({
                ok: false,
                err
            })
            return;
        }

        res.status(200).json({
            ok: true,
            usuario: resUsuario
        })
    })
})

const option = {
    new: true,
    runValidators: true,

}

const validOption = ['nombre', 'email', 'img', 'role', 'estado'];

app.put('/usuarios/:id', [verificaToken, verificaAdminRole], (req, res) => {
    const id = req.params.id;
    const data = _.pick(req.body, validOption);
    Usuario.findByIdAndUpdate(id, data, option, (err, resUsuario) => {
        if (err) {
            res.status(400).json({
                ok: false,
                err
            })
            return;
        }
        res.status(200).json({
            ok: true,
            usuario: resUsuario
        })
    })

})

app.delete('/usuarios/:id', [verificaToken, verificaAdminRole], (req, res) => {
    const id = req.params.id;

    const data = {
        estado: false
    }
    Usuario.findByIdAndUpdate(id, data, (err, resUsuario) => {
        if (err) {
            res.status(400).json({
                ok: false,
                err
            })
            return;
        }
        res.status(200).json({
            ok: true,
            usuario: resUsuario
        })
    })



})

module.exports = app;