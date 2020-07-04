const express = require('express');

const app = express();

const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken');

const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT);

const _ = require('underscore');
const Usuario = require('../models/usuarios');



app.post('/login', (req, res) => {
    let body = req.body;
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
                    message: 'Usuario o contraseña incorrectos'
                }
            });
        }

        if (!bcrypt.compareSync(body.password, usuarioDB.password)) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario o contraseña incorrectos'
                }
            });
        }

        let token = jwt.sign({
            usuario: usuarioDB
        }, process.env.SEED, {
            expiresIn: process.env.CADUCIDAD_TOKEN
        })

        return res.status(200).json({
            ok: true,
            usuario: usuarioDB,
            token
        });


    })
})

//Configuraciones de google 
async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT, // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    return {
        nombre: payload.name,
        email: payload.email,
        img: payload.image,
        google: true,
    }

}

app.post('/google', async(req, res) => {
    console.log(req.body);
    let token = req.body.idtoken;
    let googleUser = await verify(token)
        .catch((err) => {
            return res.status(400).json({
                ok: false,
                err
            })
        })
    console.log(googleUser);

    Usuario.findOne({ email: googleUser.email }, (err, usuarioDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (usuarioDB) {
            if (usuario.google) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'El usuario ya se ha registrado con un usuario '
                    }
                })
            } else {
                let token = jwt.sign({
                    usuario: usuarioDB
                }, process.env.SEED, {
                    expiresIn: process.env.CADUCIDAD_TOKEN
                })

                return res.status(200).json({
                    ok: true,
                    usuario: usuarioDB,
                    token
                })
            }
        } else { //Si el usuario no existe en la base de datos
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
                let token = jwt.sign({
                    usuario: usuarioDB
                }, process.env.SEED, {
                    expiresIn: process.env.CADUCIDAD_TOKEN
                })

                return res.status(200).json({
                    ok: true,
                    usuario: usuarioDB,
                    token
                })
            })

        }


    })

})


module.exports = app;