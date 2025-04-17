const express = require('express');
const router = express.Router();
require('dotenv').config();
const Balance = require('../user/updateBalance');

/*  make sure the order is verified 
    update the balance of the user
    update the validity of the order
*/

router.post('/', async (req,res)=>{
    const fetch = (await import('node-fetch')).default;
    const secretKey = process.env.TEST_SEC_KEY; //process.env.LIVE_SEC_KEY; 
    const {trans_ID,name} = req.body;

    try{
        const resp = await fetch(`https://api.paychangu.com/verify-payment/${trans_ID}`,{
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${secretKey}`,
            }
        });

        const data = await resp.json();

        if(data){
            if(data.status === 'success'){

                const amount = data.data.amount;
                const Resp = await Balance.UpdateBal(amount,name)

                Resp === "ok" ? res.status(200).send({message: "ok"}) : res.status(200).send({message: "err"});
            };
        };
    }
    catch(err){
        res.status(200).send({message:"CONTACT DEVS"});
    };
});


module.exports = router;