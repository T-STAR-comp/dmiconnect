const db = require('../database/sqlite.js');
require('dotenv').config();

const UpdateBal = (amount, name) => {
  return new Promise((resolve, reject) => {
    // Step 1: Get user by name
    db.get('SELECT * FROM users WHERE name = ?', [name], (err, user) => {
      if (err) {
        console.error('❌ Error fetching user:', err.message);
        return reject("err");
      }

      if (!user) {
        return resolve("err"); // user not found
      }

      const bal = user.balance;
      const newBal = bal - amount;

      if (newBal < 0) {
        return resolve("BalErr"); // insufficient balance
      }

      // Step 2: Update balance
      db.run(
        'UPDATE users SET balance = ? WHERE name = ?',
        [newBal, name],
        function (err) {
          if (err) {
            //console.error('❌ Error updating balance:', err.message);
            return reject("err");
          }

          if (this.changes > 0) {
            return resolve("ok");
          } else {
            return resolve("err");
          }
        }
      );
    });
  });
};

module.exports = { UpdateBal };
