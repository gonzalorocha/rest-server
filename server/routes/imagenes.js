const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');

const { verificaTokenImg } = require('./../middlewares/autenticacion')

app.get('/imagen/:tipo/:img', verificaTokenImg, (req, res) => {
    let { tipo, img } = req.params;

    let pathImagen = path.resolve(__dirname, `../../_upload/${tipo}/${img}`);
    if (fs.existsSync(pathImagen)) {
        res.sendFile(pathImagen);
    } else {
        let noImage = path.resolve(__dirname, './../assets/no-image.jpg')
        res.sendFile(noImage);
    }
})



module.exports = app;