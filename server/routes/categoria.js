const express = require("express");
const Categoria = require("../models/categoria");
const {
  verificaToken,
  verificaAdminRole,
} = require("../middleware/autenticacion");
const app = express();
const _ = require("underscore");

/**
 * Obtener todos las categorias
 */
// app.get("/categoria", verificaToken, (req, res) => {
app.get("/categoria", (req, res) => {
  let desde = req.query.desde || 0;
  desde = Number(desde);

  let limite = req.query.limite || 0;
  limite = Number(limite);

  Categoria.find({
    activa: true,
  })
    .skip(desde)
    .limit(limite)
    .exec((err, categorias) => {
      if (err) {
        return res.status(500).json({
          err,
        });
      }

      Categoria.count(
        {
          activa: true,
        },
        (err, count) => {
          res.json({
            ok: true,
            categorias,
            cuantos: count,
          });
        }
      );
    });
});

/**
 * Cear categoria
 */
// app.post("/categoria", [verificaToken, verificaAdminRole], (req, res) => {
app.post("/categoria", (req, res) => {
  let body = req.body;

  let categoria = new Categoria({
    nombre: body.nombre,
    descripcion: body.descripcion,
  });

  categoria.save((err, categoriaDB) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err,
      });
    }

    if (!categoriaDB) {
      return res.status(400).json({
        ok: false,
        err,
      });
    }

    res.json({
      ok: true,
      caategoria: categoriaDB,
    });
  });
});

module.exports = app;
