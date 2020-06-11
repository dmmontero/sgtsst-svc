const express = require("express");
const Documento = require("../models/documento");
const {
  verificaToken,
  verificaAdminRole,
} = require("../middleware/autenticacion");
const app = express();

/**
 * Obtener todos las Documentos
 */
// app.get("/documento", verificaToken, (req, res) => {
app.get("/documento", (req, res) => {
  let desde = req.query.desde || 0;
  desde = Number(desde);

  let limite = req.query.limite || 0;
  limite = Number(limite);

  let activo = req.query.activo || null;
  let params = {};

  if (activo !== null) params["activo"] = activo;

  Documento.find(params)
    .skip(desde)
    .limit(limite)
    .exec((err, documentos) => {
      if (err) {
        return res.status(500).json({
          err,
        });
      }

      Documento.countDocuments(
        {
          activa: true,
        },
        (err, count) => {
          res.json({
            ok: true,
            documentos,
            cuantos: count,
          });
        }
      );
    });
});

/**
 * Obtener todos las Documentos de una categoria
 */
// app.get("/documento", verificaToken, (req, res) => {
app.get("/documento/:categoria", (req, res) => {
  let desde = req.query.desde || 0;
  desde = Number(desde);

  let limite = req.query.limite || 0;
  limite = Number(limite);

  let activo = req.query.activo || null;
  let params = {};

  if (activo !== null) params["activo"] = activo;

  params["categoria"] = req.params.categoria;

  Documento.find(params)
    .skip(desde)
    .limit(limite)
    .exec((err, documentos) => {
      if (err) {
        return res.status(500).json({
          err,
        });
      }

      Documento.countDocuments(
        {
          activa: true,
        },
        (err, count) => {
          res.json({
            ok: true,
            documentos,
            cuantos: count,
          });
        }
      );
    });
});

/**
 * Cear Documento
 */
// app.post("/Documento", [verificaToken, verificaAdminRole], (req, res) => {
app.post("/documento", (req, res) => {
  let body = req.body;

  let documento = new Documento({
    categoria: body.categoria,
    descripcion: body.descripcion,
    ruta: body.ruta,
    usuarioCreador: body.usuarioCreador,
  });

  documento.save((err, documentoDB) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err,
      });
    }

    if (!documentoDB) {
      return res.status(400).json({
        ok: false,
        err,
      });
    }

    res.json({
      ok: true,
      caategoria: documentoDB,
    });
  });
});

module.exports = app;
