const mongoose = require('mongoose');
const Schema = mongoose.Schema;
/**
 * Esquema que representa un documento
 */
var documentoSchema = new mongoose.Schema({
    categoria: {
        type: Schema.Types.ObjectId,
        ref: "Categoria"
    },
    descripcion: {
        type: String,
        required: [true, 'La descripcion es requerida']
    },
    ruta:{
        type: String,
        required: [true, 'La ruta es requerida']
    },
    activo: {
        type: Boolean,
        default: true
    },
    usuarioCreador:{
        type: String
    },
    fechaCreacion:{
        type: Date,
        default: Date.now
    },
    usuarioModificador:{
        type: String
    },
    fechaModificacion:{
        type: Date,
        default: Date.now
    }
});



documentoSchema.methods.toJSON = function () {
    let user = this;
    let userObject = user.toObject();
    delete userObject.password;

    return userObject;
}

//Export the model
module.exports = mongoose.model('Docuemnto', documentoSchema, 'documentos');