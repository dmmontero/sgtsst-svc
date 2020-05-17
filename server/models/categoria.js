const mongoose = require('mongoose'); // Erase if already required
const Schema = mongoose.Schema;

/**
 * Esquemas que respresenta una categoria
 */
var categoriaSchema = new mongoose.Schema({
    descripcion: {
        type: String,
        unique: true,
        required: [true, 'La descrición es requerida']
    },
    activa: {
        type: Boolean,
        default: true
    }
    

});


//Export the model
module.exports = mongoose.model('Categoria', categoriaSchema, 'categorias');