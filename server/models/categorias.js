const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');



let Schema = mongoose.Schema;

let categoriaSchema = new Schema({
    descripcion: {
        type: String,
        required: [true, "La descripción es necesario"]
    },
    usuarios: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: [true, 'El usuarios es necesario']

    }
});

categoriaSchema.plugin(uniqueValidator, {
    message: '{PATH} debe de ser unico'
});


module.exports = mongoose.model('Categoria', categoriaSchema);