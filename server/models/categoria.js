const mongoose = require("mongoose"); // Erase if already required
const Schema = mongoose.Schema;
const uniqueValidator = require('mongoose-unique-validator'); // Mongoose validator


/**
 * Esquemas que respresenta una categoria
 */
var categoriaSchema = new mongoose.Schema({
  nombre: {
    type: String,
    unique: true,
    required: [true, "El nombre es requerido"],
  },
  descripcion: {
    type: String,
    required: [true, "La descripción es requerida"],
  },
  activa: {
    type: Boolean,
    default: true,
  },
});

/**
 * Unique validator plug-in
 */
categoriaSchema.plugin(uniqueValidator, {
  message: "{PATH} debe ser único",
});

//Export the model
module.exports = mongoose.model("Categoria", categoriaSchema, "categorias");
