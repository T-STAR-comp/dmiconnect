const express = require('express');
const router = express.Router();
const db = require('../database/sqlite.js');
const bcrypt = require('bcryptjs');
require('dotenv').config();

router.post('/', async (req, res) => {
    const { name, phonenumber, password, role } = req.body;
    const salt = await bcrypt.genSalt(10); // Generate a salt
    const hashedPassword = await bcrypt.hash(password, salt); // Hash the password

    try {
        db.get(
            'SELECT * FROM users WHERE name = ?',
            [name],
            async (err, row) => {
                if (err) {
                    return res.status(500).send({ message: "INTERNAL ERROR" });
                }

                if (!row) {
                    db.run(
                        'INSERT INTO users (name, phonenumber, password, role) VALUES (?, ?, ?, ?)',
                        [name, phonenumber, hashedPassword, role],
                        function (err) {
                            if (err) {
                                return res.status(500).send({ message: "INTERNAL ERROR" });
                            }

                            if (this.changes > 0) {
                                res.status(200).send({ message: 'CREATED SUCCESSFULLY' });
                            }
                        }
                    );
                } else {
                    res.status(200).send({ message: "CANNOT CREATE>>>>try changing the NAME" });
                }
            }
        );
    } catch (err) {
        res.status(500).send({ message: "INTERNAL ERROR" });
    }
});

module.exports = router;
