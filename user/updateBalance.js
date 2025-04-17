const db = require('../database/sqlite.js');
require('dotenv').config();

const UpdateBal = async (amount, name) => {
  return new Promise((resolve, reject) => {
    db.get('SELECT * FROM users WHERE name = ?', [name], (err, row) => {
      if (err) {
        console.error("❌ Error selecting user:", err.message);
        return resolve("err");
      }

      if (!row) {
        return resolve("err");
      }

      const bal = row.balance;
      const fee = amount * 1 / 100;
      const newAmount = amount - fee;
      const newBal = newAmount + bal;

      db.run('UPDATE users SET balance = ? WHERE name = ?', [newBal, name], function (updateErr) {
        if (updateErr) {
          console.error("❌ Error updating balance:", updateErr.message);
          return resolve("err");
        }

        if (this.changes > 0) {
          return resolve("ok");
        } else {
          return resolve("err");
        }
      });
    });
  });
};

module.exports = { UpdateBal };
