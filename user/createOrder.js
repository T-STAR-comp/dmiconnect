const express = require('express');
const router = express.Router();
const db = require('../database/sqlite.js'); // your already initialized sqlite3 connection
require('dotenv').config();

// Function to generate an 8-character random code
function generateRandomCode() {
    const chars = "ABCDEFGHIJKLMNPQRSTUVWXYZabcdefghijklmnpqrstuvwxyz123456789";
    let code = "";
    for (let i = 0; i < 8; i++) {
        const randomIndex = Math.floor(Math.random() * chars.length);
        code += chars[randomIndex];
    }
    return code;
}

router.post('/', (req, res) => {
    const { customer, hostel, room, orderName, quantity, name } = req.body;
    const orderID = generateRandomCode();

    if (!customer || !hostel || !room || !orderName || !quantity || !name) {
        return res.status(400).json({ message: "All fields are required!" });
    }

    const insertQuery = `
        INSERT INTO orders (customer, hostel, room, orderName, quantity, orderID, user, email, state)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    // For now we'll insert nulls for email and state unless you have them in the body
    const email = 'const@icloud.com';
    const state = 0;

    db.run(
        insertQuery,
        [customer, hostel, room, orderName, quantity, orderID, name, state],
        function (err) {
            if (err) {
                //console.error('❌ Error inserting order:', err.message);
                return res.status(500).json({ message: "INTERNAL SERVER ERROR" });
            }

            // `this` refers to the context of the run() call and contains the last inserted ID
            if (this.changes > 0) {
                return res.status(201).json({ message: "ok", orderID });
            } else {
                return res.status(400).json({ message: "Insert failed" });
            }
        }
    );
});

module.exports = router;
