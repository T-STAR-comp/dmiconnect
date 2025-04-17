const express = require('express');
const router = express.Router();
const db = require('../database/sqlite.js');
require('dotenv').config();

router.delete('/', async (req, res) => {
    const { name } = req.body;

    try {
        db.get('SELECT * FROM users WHERE name = ?', [name], (err, row) => {
            if (err) {
                return res.status(500).send({ message: "INTERNAL ERROR" });
            }

            if (row) {
                db.run('DELETE FROM users WHERE name = ?', [name], function (err) {
                    if (err) {
                        return res.status(500).send({ message: "INTERNAL ERROR" });
                    }

                    if (this.changes > 0) {
                        res.status(200).send({ message: 'DELETED SUCCESSFULLY' });
                    }
                });
            } else {
                res.status(200).send({ message: "USER DOES NOT EXIST" });
            }
        });
    } catch (err) {
        res.status(500).send({ message: "INTERNAL ERROR" });
    }
});

module.exports = router;
