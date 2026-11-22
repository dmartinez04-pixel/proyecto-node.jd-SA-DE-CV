const express = require('express');
const employee = express.Router();
const db = require('../config/database');
 

employee.post("/", async (req, res, next) =>{
    
    const { em_name, em_lastname, em_phone, em_email, em_direccion } = req.body;
    
    if(em_name && em_lastname && em_email && em_phone){
        let query = "INSERT INTO employees (em_name, em_lastname, em_phone, em_email, em_direccion)";
        query += ` VALUES ('${em_name}', '${em_lastname}', '${em_phone}', '${em_email}', '${em_direccion}')`;
    
    
    const rows = await db.query(query);

    if(rows.affectedRows == 1){
        return res.status(201).json({code: 201, message: "Empleado insertado correctamente"});
    }

    return res.status(500).json({code: 500, message: "Ocurrio un error"});
    }

    return res.status(500).json({code: 500, message: "Campos incompletos"});
    
});

employee.delete("/:id", async (req, res, next) =>{
    if (!/^\d+$/.test(req.params.id)) {
        return next();
    }

    const query = `DELETE FROM employees WHERE em_id =${req.params.id}`;

    const rows = await db.query(query);

    if(rows.affectedRows == 1){
        return res.status(200).json({code: 200, message: "Empleado borrado correctamente"});
    }

    return res.status(404).json({code: 404, message: "Empleado no encontrado"});
});

employee.put("/:id", async (req, res, next) =>{
    if (!/^\d+$/.test(req.params.id)) {
        return next();
    }


    const { em_id, em_name, em_lastname, em_phone, em_email, em_direccion } = req.body;
    
    if(em_name && em_lastname && em_email && em_phone){
       let query = `UPDATE employees SET em_name='${em_name}', em_lastname='${em_lastname}', em_phone='${em_phone}', em_email='${em_email}', em_direccion='${em_direccion}' WHERE em_id = ${req.params.id}`;

    const rows = await db.query(query);

    if(rows.affectedRows == 1){
        return res.status(200).json({code: 200, message: "Empleado actualizado correctamente"});
    }

    return res.status(500).json({code: 500, message: "Ocurrio un error"});
    }

    return res.status(500).json({code: 500, message: "Campos incompletos"});
}); 

employee.patch("/:id", async (req, res, next) =>{
    if (!/^\d+$/.test(req.params.id)) {
        return next();
    }

    if(req.body.em_name){
        let query = `UPDATE employees SET em_name='${req.body.em_name}' WHERE em_id=${req.params.id}`;
        const rows = await db.query(query);

        if(rows.affectedRows == 1){
            return res.status(200).json({code: 200, message: "Empleado actualizado correctamente"});
        }
        return res.status(500).json({code: 500, message: "Ocurrio un error"});
    }
    return res.status(500).json({code: 500, message: "Campos incompletos"});
}); 

employee.get("/", async (req, res, next) =>{
    const empl = await db.query("SELECT * FROM employees");
    return res.status(200).json({code: 200, message: empl});
});

employee.get('/:id', async (req, res, next) =>{
    if (!/^\d+$/.test(req.params.id)) {
        return next();
    }

    const id = req.params.id;
    if (id >= 1 && id <= 1000) {
        const empl = await db.query("SELECT * FROM employees WHERE em_id = "+ id);
        return res.status(200).json({code: 200, message: empl});
    }

    return res.status(404).json({code: 404, message: "Empleado no encontrado"});
});

employee.get('/:name', async (req, res, next) =>{
    const name = req.params.name;

    if (!/^[a-zA-Z]+$/.test(name)) {
            return next();
    }
     
    const empl = await db.query("SELECT * FROM employees WHERE em_name = '" + name + "';");
    if (empl.length > 0) {
        return res.status(200).json({code: 200, message: empl});
    }
    return res.status(404).json({code: 404, message: "Empleado no encontrado"}); 
});

module.exports = employee;