const express = require("express");
const Categoria = require("../models/categoria");
const Documento = require("../models/documento");
const {
  verificaToken,
  verificaAdminRole,
} = require("../middleware/autenticacion");
const app = express();

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

      Categoria.countDocuments(
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

app.get("/categoria/documentos", (req, res) => {
  let desde = req.query.desde || 0;
  desde = Number(desde);

  let limite = req.query.limite || 0;
  limite = Number(limite);

  let activo = req.query.activo || null;
  let params = {};

  params["activa"] = true;

  Categoria.find(params)
    .populate({
      path: "documentos",
      match: { activo: true },
      limit: 1,
    })
    .skip(desde)
    .limit(limite)
    .exec((err, categorias) => {
      if (err) {
        return res.status(500).json({
          err,
        });
      }

      Categoria.countDocuments(
        {
          activa: true,
        },
        (err, count) => {
          res.json({
            ok: true,
            categorias,
            cuantas: count,
          });
        }
      );
    });
});

app.post("/categoria/inactivardocs/:categoria", (req, res) => {
  let categoria = req.params.categoria;

  const inactivarDocsCat = async (idCategoria) => {
    const filter = { categoria: idCategoria },
      update = { $set: { activo: true } },
      opts = { new: true };

    return Documento.updateMany(filter, update, opts);
  };

  const catDocs = async (idCategoria) => {
    let catDocs = await inactivarDocsCat(idCategoria);
    let docs = await Categoria.findById(idCategoria).populate("documentos");
    return docs;
  };

  catDocs(categoria)
    .then((result) => {
      res.json({
        ok: true,
        data: result,
      });
    })
    .catch((err) => {
      res.status(500).json({
        err,
      });
    });
});

module.exports = app;
