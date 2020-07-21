const express = require("express");
const Documento = require("../models/documento");
const Categoria = require("../models/categoria");
const {
  verificaToken,
  verificaAdminRole,
} = require("../middleware/autenticacion");
const categoria = require("../models/categoria");
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
  let body = req.body,
    documento = new Documento({
      categoria: body.categoria,
      descripcion: body.descripcion,
      ruta: body.ruta,
      usuarioCreador: body.usuarioCreador,
    });

  //Guardar docuemnto
  const guardarDoc = async (documento) => {
    return documento.save();
  };

  //Asociar a categoria
  const guardarCategoria = async (documento) => {
    return Categoria.findByIdAndUpdate(
      body.categoria,
      {
        // $set: { "documentos.$[].usuarioModificador": "victorLulu" },
        $push: { documentos: documento },
      },
      {
        safe: true,
        upsert: true,
        new: true,
      }
    );
  };

  const saveDoc = async (documento) => {
    let doc = await guardarDoc(documento);
    let categoria = await guardarCategoria(doc);
    return categoria;
  };

  saveDoc(documento)
    .then((documentoDB) => {
      //Si no guardó el documento
      if (!documentoDB) {
        return res.status(400).json({
          ok: false,
          err,
        });
      }

      return res.json({
        ok: true,
        documento: documento,
      });
    })
    .catch((err) => {
      return res.status(500).json({
        ok: false,
        err,
      });
    });
});

app.post("/documento/inactivardocs/:categoria", (req, res) => {
  let _categoria = req.params.categoria;

  const filter = { categoria: _categoria },
    update = { $set: { activo: false } },
    opts = { new: true };

  Documento.updateMany(filter, update, opts).exec((err, data) => {
    if (err) {
      return res.status(500).json({
        err,
      });
    }

    res.json({
      ok: true,
      data,
    });
  });
});

module.exports = app;
