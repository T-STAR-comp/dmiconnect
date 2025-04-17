const express = require('express');
const router = express.Router();
const db = require('../database/sqlite.js');
const bcrypt = require('bcryptjs');
require('dotenv').config();

router.post('/', async (req, res) => {
    const { name, password, role } = req.body;

    try {
        db.get(
            'SELECT * FROM users WHERE name = ? AND role = ?',
            [name, role],
            async (err, row) => {
                if (err) {
                    return res.status(500).send({ message: "INTERNAL ERROR" });
                }

                if (row) {
                    const storedHash = row.password;
                    const isMatch = await bcrypt.compare(password, storedHash);

                    if (isMatch) {
                        res.status(200).send({
                            name: row.name,
                            phonenum: row.phonenumber,
                            balance: row.balance,
                            role: row.role,
                            message: "ok"
                        });
                    } else {
                        res.status(200).send({ message: "INCORRECT PASSWORD" });
                    }
                } else {
                    res.status(200).send({ message: "NO USER FOUND" });
                }
            }
        );
    } catch (err) {
        res.status(500).send({ message: "INTERNAL ERROR" });
    }
});

module.exports = router;
