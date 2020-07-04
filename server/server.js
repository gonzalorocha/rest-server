require('./config/config');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require('path'); //paquete de node

const mongoose = require('mongoose');

//app.use es un middleware 

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.use(require('./routes/index'));


app.get('/', (req, res) => {
    res.send('')
});

//Habilitar la carpeta public para cualquier 
app.use(express.static(path.resolve(__dirname, '../public')));

mongoose.connect(process.env.URLDB, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

app.listen(process.env.PORT, () => {
    console.log(`Esscuchando puerto ${process.env.PORT}`)
});