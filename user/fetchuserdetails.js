const express = require('express');
const router = express.Router();
const db = require('../database/sqlite.js');
require('dotenv').config();

router.post('/', (req, res) => {
  const { user } = req.body;

  if (!user) {
    return res.status(400).json({ message: "User name is required" });
  }

  db.get(
    'SELECT * FROM users WHERE name = ?',
    [user],
    (err, row) => {
      if (err) {
        console.error('❌ Error querying user:', err.message);
        return res.status(500).json({ message: "INTERNAL ERROR" });
      }

      if (row) {
        return res.status(200).json({
          balance: row.balance,
          name: row.name,
          role: row.role,
          phonenum: row.phonenumber,
          message: "ok"
        });
      } else {
        return res.status(200).json({ message: "NULL" });
      }
    }
  );
});

module.exports = router;
