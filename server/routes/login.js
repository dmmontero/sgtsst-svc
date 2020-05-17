const express = require("express");
const Usuario = require("../models/usuario");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const saltRounds = 10;
const app = express();

app.post('/login', (req, res) => {

    let body = req.body;

    Usuario.findOne({
        username: body.username
    }, (err, usuarioDB) => {

        if (err) {
            return res.status(500).json({
                err,
            });
        }

        if (!usuarioDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario o contaseña invalidos!'
                }
            });
        }

        //Compara clave encrypatada (de un solo sentido) con clave enviada
        if (!bcrypt.compareSync(body.password, usuarioDB.password)) {

            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario o contaseña inválidos!'
                }
            });

        }

        let token = createToken(usuarioDB);

        res.json({
            ok: true,
            Usuario: usuarioDB,
            token
        });
    })
})


let createToken = (usuario) => {
    let token = jwt.sign({
        usuario: usuario
    }, process.env.SEED, {
        expiresIn: process.env.CADUCIDAD_TOKEN,
        algorithm: 'HS256'
    });

    return token;
}

module.exports = app;