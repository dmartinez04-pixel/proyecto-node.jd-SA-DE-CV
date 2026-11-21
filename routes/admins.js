const express = require('express');
const jwt = require('jsonwebtoken');
const admin = express.Router();
const db = require('../config/database');

admin.post("/login", async(req, res, next) => {
    const { ma_email, ma_password } = req.body;
    const query = `SELECT * FROM admins WHERE ma_email = '${ma_email}' AND ma_password = '${ma_password}'`;
    const rows = await db.query(query);

    if(ma_email && ma_password){
        if(rows.length == 1){
            const token = jwt.sign({ 
                ma_id: rows[0].ma_id,
                ma_email: rows[0].ma_email
            }, "debugkey");
            return res.status(200).json({ code: 200, message: token });
        }   
        else{
            return res.status(200).json({code: 401, message: "Usuario y/o contraseña incorrectos"});
        }
    }
    return res.status(200).json({ code: 500, message: "Campos incompletos"});
});

module.exports = admin;
    