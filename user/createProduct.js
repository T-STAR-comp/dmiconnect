const express = require('express');
const router = express.Router();
const db = require('../database/sqlite.js');
require('dotenv').config();

router.post('/', (req, res) => {
    const { prodName, price, image, name } = req.body;

    if (!prodName || !price || !name) {
        return res.status(400).json({ message: "Missing required fields." });
    }

    // Step 1: Check if user exists
    db.get(
        'SELECT * FROM users WHERE name = ?',
        [name],
        (err, user) => {
            if (err) {
                //console.error("❌ Error finding user:", err.message);
                return res.status(500).json({ message: "INTERNAL ERROR" });
            }

            if (!user) {
                return res.status(200).json({ message: "CANNOT CREATE" });
            }

            // Step 2: Insert the product
            db.run(
                'INSERT INTO products (product, price, imageUrl, user) VALUES (?, ?, ?, ?)',
                [prodName, price, image, name],
                function (err) {
                    if (err) {
                        //console.error("❌ Error inserting product:", err.message);
                        return res.status(500).json({ message: "INTERNAL ERROR" });
                    }

                    if (this.changes > 0) {
                        return res.status(200).json({ message: "PRODUCT CREATED SUCCESSFULLY" });
                    } else {
                        return res.status(200).json({ message: "INSERT FAILED" });
                    }
                }
            );
        }
    );
});

module.exports = router;
