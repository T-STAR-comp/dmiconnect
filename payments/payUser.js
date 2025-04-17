const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const db = require('../database/sqlite.js');
const Balance = require('../user/decreaseBal.js');
require('dotenv').config();

router.post('/', async (req, res) => {
  const { mobileNum, user, operator, amount, password } = req.body;

  if (amount <= 0) {
    return res.status(200).send({ message: "NUM ERROR" });
  }

  const url = 'https://api.paychangu.com/mobile-money/payouts/initialize';
  const generateChargeId = () => `PC-${uuidv4()}`;
  const TNM_MPAMBA = '27494cb5-ba9e-437f-a114-4e7a7686bcca';
  const AIRTEL_MONEY = '20be6c20-adeb-4b5b-a7ba-0769820df4fb';
  const secretKey = process.env.TEST_SEC_KEY;

  const data = {
    mobile_money_operator_ref_id: operator === 'TNM' ? TNM_MPAMBA : AIRTEL_MONEY,
    mobile: mobileNum,
    amount: amount,
    email: 'ysam3655@gmail.com',
    charge_id: generateChargeId()
  };

  const options = {
    method: 'POST',
    headers: {
      'accept': 'application/json',
      'content-type': 'application/json',
      'Authorization': `Bearer ${secretKey}`
    },
    body: JSON.stringify(data)
  };

  db.get('SELECT * FROM users WHERE name = ?', [user], async (err, row) => {
    if (err) {
      console.error("❌ DB error:", err.message);
      return res.status(200).send({ message: "INTERNAL ERROR" });
    }

    if (!row) {
      return res.status(200).send({ message: "AN ERROR OCCURRED, PLEASE CONTACT DEVS" });
    }

    const isMatch = await bcrypt.compare(password, row.password);

    if (!isMatch) {
      return res.status(200).send({ message: "INCORRECT PASSWORD" });
    }

    const bal = row.balance;
    const fee = amount * 3 / 100;
    const charge = amount + fee;
    const condition = bal - charge;

    if (condition < 0) {
      return res.status(200).send({ message: "ERROR__YOUR BALANCE CANNOT SETTLE TRANSACTION" });
    }

    if (bal < amount) {
      return res.status(200).send({ message: "INSUFFICIENT FUNDS" });
    }

    try {
      const response = await fetch(url, options);
      const result = await response.json();

      if (result.status === 'success') {
        const Resp = await Balance.UpdateBal(result.data.amount, user);
        if (Resp === "ok") {
          return res.status(200).send({ message: "PAYOUT SUCCESSFUL" });
        } else {
          return res.status(200).send({ message: "SYSTEM ERROR" });
        }
      } else {
        return res.status(200).send({ message: "PAYCHANGU ERROR" });
      }
    } catch (fetchErr) {
      console.error("❌ Fetch error:", fetchErr.message);
      return res.status(200).send({ message: "ERROR PROCESSING PAYOUT" });
    }
  });
});

module.exports = router;
