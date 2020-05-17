const mongoose = require('mongoose'); // Erase if already required
const uniqueValidator = require('mongoose-unique-validator'); // Mongoose validator

let Roles = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} Rol no válido'
}
// Esquema que representa un usuario
var usuarioSchema = new mongoose.Schema({
    username:{
        type: String,
        required: [true, 'El username es requerido'],
        unique: true
    },
    nombre: {
        type: String,
        required: [true, 'El nombre es requerido']
    },
    email: {
        type: String,
        required: [true, 'El correo es requerido'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'La contraseña es requerida']
    },
    img: {
        type: String,
        required: false
    },
    role: {
        type: String,
        default: 'USER_ROLE',
        enum: Roles
    },
    activo: {
        type: Boolean,
        default: true
    }
});

/**
 * Unique validator plug-in
 */
usuarioSchema.plugin(uniqueValidator, {
    message: '{PATH} debe ser único'
});

/**
 * Override method toJSON
 */
usuarioSchema.methods.toJSON = function () {
    let user = this;
    let userObject = user.toObject();
    delete userObject.password;
    return userObject;
}

//Export the model
module.exports = mongoose.model('Usuario', usuarioSchema, 'usuarios');
