const express = require('express');
const router = express.Router();
const db = require('../database/sqlite.js');
require('dotenv').config();

router.post('/', (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ message: "Name is required" });
  }

  db.all(
    'SELECT * FROM orders WHERE user = ? AND state = ?',
    [name, 1],
    (err, rows) => {
      if (err) {
        console.error('❌ Error querying orders:', err.message);
        return res.status(500).json({ message: "INTERNAL ERROR" });
      }

      if (rows.length > 0) {
        return res.status(200).json(rows);
      } else {
        return res.status(200).json({ message: "NOn" });
      }
    }
  );
});

module.exports = router;
