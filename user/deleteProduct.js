const express = require('express');
const router = express.Router();
const db = require('../database/sqlite.js');
const bcrypt = require('bcryptjs');
require('dotenv').config();

router.delete('/', (req, res) => {
  const { product, name } = req.body;

  if (!product || !name) {
    return res.status(400).json({ message: 'Product and user name are required' });
  }

  // Step 1: Check if the product exists for the user
  db.get(
    'SELECT * FROM products WHERE product = ? AND user = ?',
    [product, name],
    (err, row) => {
      if (err) {
        console.error('❌ Error querying product:', err.message);
        return res.status(500).json({ message: 'INTERNAL ERROR' });
      }

      if (!row) {
        return res.status(200).json({ message: 'PRODUCT DOES NOT EXIST' });
      }

      // Step 2: Delete the product
      db.run(
        'DELETE FROM products WHERE product = ? AND user = ?',
        [product, name],
        function (err) {
          if (err) {
            console.error('❌ Error deleting product:', err.message);
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
