const express = require("express");
const Usuario = require("../models/usuario");
const {
  verificaToken,
  verificaAdminRole,
} = require("../middleware/autenticacion");
const app = express();
const bcrypt = require("bcrypt");
const saltRounds = 10;
const _ = require("underscore");

/**
 * Obtener todos los usuarios
 */
app.get("/usuario", verificaToken, (req, res) => {
  let desde = req.query.desde || 0;
  desde = Number(desde);

  let limite = req.query.limite || 0;
  limite = Number(limite);

  Usuario.find(
    {
      activo: true,
    },
    "username nombre email img role activo"
  )
    .skip(desde)
    .limit(limite)
    .exec((err, usuarios) => {
      if (err) {
        return res.status(500).json({
          err,
        });
      }

      Usuario.count(
        {
          activo: true,
        },
        (err, count) => {
          res.json({
            ok: true,
            usuarios,
            cuantos: count,
          });
        }
      );
    });
});

/**
 * Cear Usuario
 */
// app.post("/usuario", [verificaToken, verificaAdminRole], (req, res) => {
app.post("/usuario", (req, res) => {
  let body = req.body;

  let usuario = new Usuario({
    username: body.username,
    nombre: body.nombre,
    email: body.email,
    password: bcrypt.hashSync(body.password, saltRounds),
    role: body.role,
  });

  usuario.save((err, usuarioDB) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err,
      });
    }

    if (!usuarioDB) {
      return res.status(400).json({
        ok: false,
        err,
      });
    }

    res.json({
      ok: true,
      usuario: usuarioDB,
    });
  });
});

/**
 * Actualizar usuario
 */
app.put("/usuario/:id", [verificaToken, verificaAdminRole], (req, res) => {
  let id = req.params.id;
  let body = _.pick(req.body, [
    "username",
    "nombre",
    "email",
    "img",
    "role",
    "activo",
    "password",
  ]);

  if (body.password) body.password = bcrypt.hashSync(body.password, saltRounds);

  Usuario.findByIdAndUpdate(
    id,
    body,
    {
      new: true,
      runValidators: true,
    },
    (err, usuarioDB) => {
      if (err) {
        return res.status(400).json({
          err,
        });
      }

      res.json({
        ok: true,
        usuario: usuarioDB,
      });
    }
  );
});

app.delete("/usuario", [verificaToken, verificaAdminRole], (req, res) => {
  let id = req.body.id;

  Usuario.findByIdAndDelete(id, (err, usuarioDB) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        err,
      });
    }

    if (!usuarioDB) {
      return res.status(400).json({
        ok: false,
        error: {
          message: "Usuario no encontrado",
        },
      });
    }

    res.json({
      ok: true,
      usuario: usuarioDB,
    });
  });
});

app.delete("/usuario/:id", [verificaToken, verificaAdminRole], (req, res) => {
  let id = req.params.id;

  let activo = {
    activo: false,
  };

  Usuario.findByIdAndUpdate(
    id,
    activo,
    {
      new: true,
    },
    (err, usuarioDB) => {
      if (err) {
        return res.status(500).json({
          err,
        });
      }

      if (!usuarioDB) {
        return res.status(400).json({
          ok: false,
          error: {
            message: "Usuario no encontrado",
          },
        });
      }

      res.json({
        ok: true,
        usuario: usuarioDB,
      });
    }
  );
});

module.exports = app;
