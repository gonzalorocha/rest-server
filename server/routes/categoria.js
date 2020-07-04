const express = require('express');
const app = express();
const _ = require('underscore');

const Categoria = require('./../models/categorias');
const { verificaToken, verificaAdminRole } = require('../middlewares/autenticacion');

app.get('/categoria', verificaToken, (req, res) => {
    Categoria.find({})
        .sort('descripcion')
        .populate('usuarios', 'usuarios') //Usuario es el nombre de la coleccion
        .exec((err, categoria) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                categoria
            })
        })

})

app.get('/categoria/:id', verificaToken, (req, res) => {
    let id = req.params.id;

    Categoria.findById(id, (err, categoriaDB) => {
        if (err) {
            res.status(400).json({
                ok: false,
                err
            })
            return;
        }
        res.status(200).json({
            ok: true,
            categoria: categoriaDB
        })
    })
})

app.post('/categoria', verificaToken, (req, res) => {

    let body = req.body;

    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuarios: req.usuario._id
    });

    categoria.save((err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categoriaDB
        })
    })
})

const option = {
    new: true,
    runValidators: true
}

app.put('/categoria/:id', verificaToken, (req, res) => {

    let id = req.params.id;
    let data = {
        descripcion: req.body.descripcion
    }
    Categoria.findByIdAndUpdate(id, data, option, (err, resCategoria) => {
        if (err) {
            res.status(400).json({
                ok: false,
                err
            })
            return;
        }
        res.status(200).json({
            ok: true,
            categoria: resCategoria
        })
    })
})

app.delete('/categoria/:id', [verificaToken, verificaAdminRole], (req, res) => {
    const id = req.params.id;

    const data = {
        estado: false
    }
    Categoria.findByIdAndRemove(id, data, (err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!categoriaDB) {
            res.status(400).json({
                ok: false,
                err: {
                    message: "Categoria no encontrada "
                }
            });
        }

        res.status(200).json({
            ok: true,
            categoria: categoriaDB
        })
    })

})

module.exports = app;