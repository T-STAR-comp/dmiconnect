const express = require('express');
const router = express.Router();
const db = require('../database/sqlite.js');
const bcrypt = require('bcryptjs');
require('dotenv').config();

router.delete('/', (req, res) => {
  const { orderID, name } = req.body;

  if (!orderID || !name) {
    return res.status(400).json({ message: 'orderID and name are required' });
  }

  // Step 1: Check if the order exists for the user
  db.get(
    'SELECT * FROM orders WHERE orderID = ? AND user = ?',
    [orderID, name],
    (err, row) => {
      if (err) {
        console.error('❌ Error finding order:', err.message);
        return res.status(500).json({ message: 'INTERNAL ERROR' });
      }

      if (!row) {
        return res.status(200).json({ message: 'USER DOES NOT EXIST' });
      }

      // Step 2: Delete the order
      db.run(
        'DELETE FROM orders WHERE orderID = ? AND user = ?',
        [orderID, name],
        function (err) {
          if (err) {
            console.error('❌ Error deleting order:', err.message);
            return res.status(500).json({ message: 'INTERNAL ERROR' });
          }

          if (this.changes > 0) {
            return res.status(200).json({ message: 'DELETED SUCCESSFULLY' });
          } else {
            return res.status(400).json({ message: 'DELETE FAILED' });
          }
        }
      );
    }
  );
});

module.exports = router;
