const express = require('express');
const router = express.Router();
const db = require('../database/sqlite.js');
require('dotenv').config();

router.post('/', (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ message: "User name is required" });
  }

  db.all('SELECT * FROM products WHERE user = ?', [name], (err, rows) => {
    if (err) {
      console.error("❌ Error querying products:", err.message);
      return res.status(500).json({ message: "INTERNAL ERROR" });
    }

    if (rows.length > 0) {
      return res.status(200).json(rows);
    } else {
      return res.status(200).json({ message: "NO PRODUCTS FOUND" });
    }
  });
});

module.exports = router;
