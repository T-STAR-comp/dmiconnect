const express = require('express');
const router = express.Router();
const db = require('../database/sqlite.js');
require('dotenv').config();

router.get('/', (req, res) => {
    db.all('SELECT * FROM users', [], (err, rows) => {
        if (err) {
            return res.status(500).send({ message: "INTERNAL ERROR" });
        }

        if (rows.length > 0) {
            res.status(200).send(rows);
        } else {
            res.status(200).send({ message: "NULL" });
        }
    });
});

module.exports = router;
