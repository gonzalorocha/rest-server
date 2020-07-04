const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const rolesValidos = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un rol valido'
}


let Schema = mongoose.Schema;

let usuarioSchema = new Schema({
    nombre: {
        type: String,
        required: [true, "El nombre es necesario"]
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'El correo es necesario']
    },
    password: {
        type: String,
        required: [true, 'la contraseña es obligatoria']
    },
    img: {
        type: String,
        required: false
    },
    role: {
        type: String,
        default: "USER_ROLE",
        enum: rolesValidos
    },
    estado: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: false
    },
});

usuarioSchema.method.ToJSON = function() { //Se usa function porque necesitamos invocarla con this 
    let user = this;
    let auxUser = user.toObject();
    delete auxUser.password;
    return auxUser;
}

usuarioSchema.plugin(uniqueValidator, {
    message: '{PATH} debe de ser unico'
});


module.exports = mongoose.model('Usuario', usuarioSchema);