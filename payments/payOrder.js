const express = require('express');
const router = express.Router();
require('dotenv').config();

router.post('/', async (req, res) => {
    let fetch;
    try {
        fetch = (await import('node-fetch')).default;
    } catch (error) {
        return res.status(500).json({ error: "Failed to import fetch module" });
    }

    const secretKey = process.env.TEST_SEC_KEY;
    const paychanguURL = process.env.PAYCHANGU_URL;
    const randomTxRef = Math.floor(Math.random() * 1000000000) + 1;

    if (!req.body.amount || !req.body.email) {
        return res.status(400).json({ error: "Missing required payment details" });
    }

    const paymentData = {
        amount: req.body.amount,
        currency: "MWK",
        email: req.body.email,
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        callback_url: process.env.callbaclUrl,
        return_url: process.env.returnUrl,
        tx_ref: randomTxRef.toString(),
        meta: req.body.meta || {}
    };

    try {
        const response = await fetch(paychanguURL, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${secretKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(paymentData)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const responseData = await response.json();
        res.status(200).json(responseData);

    } catch (error) {
        res.status(500).json({ error: 'Failed to process payment' });
    }
});

module.exports = router;
