const express = require('express');
const router = express.Router();
const db = require('../database/sqlite.js');
require('dotenv').config();

router.put('/', async (req, res) => {
    const { orderID } = req.body;

    if (!orderID) {
        return res.status(400).json({ message: "All fields are required!" });
    }

    try {
        db.get('SELECT * FROM orders WHERE orderID = ?', [orderID], async (err, row) => {
            if (err) {
                return res.status(500).json({ message: "INTERNAL SERVER ERROR" });
            }

            if (row) {
                db.run('UPDATE orders SET state = ? WHERE orderID = ?', [1, orderID], function(updateErr) {
                    if (updateErr) {
                        return res.status(500).json({ message: "INTERNAL SERVER ERROR" });
                    }

                    if (this.changes > 0) {
                        return res.status(201).json({ message: "ok" });
                    } else {
                        return res.status(400).json({ message: "no" });
                    }
                });
            } else {
                return res.status(404).json({ message: "Order not found" });
            }
        });
    } catch (err) {
        return res.status(500).json({ message: "INTERNAL SERVER ERROR" });
    }
});

module.exports = router;
