const express = require('express');
const router = express.Router();
const db = require('../database/sqlite.js');
require('dotenv').config();

router.get('/', async (req, res) => {
    try {
        db.all('SELECT * FROM products', [], (err, rows) => {
            if (err) {
                return res.status(500).send({ message: "INTERNAL ERROR" });
            }

            if (rows.length > 0) {
                res.status(200).send(rows);
            } else {
                res.status(200).send({ message: "NO PRODUCTS FOUND" });
            }
        });
    } catch (err) {
        res.status(500).send({ message: "INTERNAL ERROR" });
    }
});

module.exports = router;
