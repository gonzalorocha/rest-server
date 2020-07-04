const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();
// default options
app.use(fileUpload({ useTempFiles: true }));

const fs = require('fs');
const path = require('path');

const Usuario = require('./../models/usuarios');
const Producto = require('./../models/productos');



const extensionesValidas = ['png', 'jpg', 'gif', 'jpge'];
const tiposValidos = ['productos', 'usuarios'];

app.put('/upload/:tipo/:id', (req, res) => {

    let tipo = req.params.tipo;
    let id = req.params.id;

    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({
            ok: false,
            message: 'No se ha seleccionado ningun archivo'
        });
    }

    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            message: 'tipo no valido'
        });
    }

    // The name of the input field (i.e. "archivo") is used to retrieve the uploaded file
    let archivo = req.files.archivo;
    let nombreArray = archivo.name.split('.');
    let extension = nombreArray[nombreArray.length - 1];


    if (extensionesValidas.indexOf(extension) < 0) {
        return res.status(400).json({
            ok: false,
            message: 'Extension no valida'
        });
    }

    //Cambiar nombre al archivo 
    let nombreArchivo = `${id}-${new Date().getSeconds()}${new Date().getMilliseconds()}.${extension}` //Hay que modificar el nombre del archivo para que no pase que se pisen 

    // Use the mv() method to place the file somewhere on your server
    const path = `_upload/${tipo}/${nombreArchivo}`;


    archivo.mv(path, (err) => { //mueve el archivo
        if (err) {
            borraArchivo(nombreArchivo, tipo);
            return res.status(500).json({
                ok: false,
                message: 'Hubo un error al subir ' + err
            });
        }

        if (tipo === 'usuarios') {
            imagenUsuario(id, res, nombreArchivo);
        } else {
            imagenProducto(id, res, nombreArchivo);
        }
    });

});

const imagenProducto = (id, res, nombreArchivo) => {
    Producto.findById(id, (err, productoDB) => {
        if (err) {
            borraArchivo(nombreArchivo, 'productos');

            return res.status(500).json({
                ok: false,
                err,
            })
        }

        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'usuario no existe'
                },
            })
        }

        borraArchivo(productoDB.img, 'productos');
        productoDB.img = nombreArchivo;
        productoDB.save((err, productosGuardado) => {
            res.json({
                ok: true,
                producto: productosGuardado,
                img: nombreArchivo
            })
        })

    })
}

const imagenUsuario = (id, res, nombreArchivo) => {
    Usuario.findById(id, (err, usuarioDB) => {
        if (err) {
            borraArchivo(nombreArchivo, 'usuarios');

            return res.status(500).json({
                ok: false,
                err,
            })
        }

        if (!usuarioDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'usuario no existe'
                },
            })
        }

        borraArchivo(usuarioDB.img, 'usuarios');
        usuarioDB.img = nombreArchivo;
        usuarioDB.save((err, usuarioGuardado) => {
            res.json({
                ok: true,
                usuario: usuarioGuardado,
                img: nombreArchivo
            })
        })

    })
}

const borraArchivo = (nombreImagen, tipo, ) => {
    let pathImagen = path.resolve(__dirname, `../../_upload/${tipo}/${nombreImagen}`);
    if (fs.existsSync(pathImagen)) {
        fs.unlinkSync(pathImagen);
    }
}



module.exports = app;