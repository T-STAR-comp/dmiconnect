const express = require('express');
const cors = require('cors');
const path = require('path');
const bodyParser = require('body-parser');
require('dotenv').config();
const db = require('./database/sqlite.js');
const app = express();
const port = process.env.PORT_NUM || '8080';

//require routes and controls
//const createDBConnection = require('./database/DBconn.js');
const GetUsers = require('./routers/fetchusers.js');
const CreateUser = require('./routers/createUser.js');
const DeleteUser = require('./routers/deleteUser.js');
//user
const FetchProducts = require('./user/fetchUserprod.js');
const CreateProduct = require('./user/createProduct.js');
const DeleteProduct = require('./user/deleteProduct.js');
const FetchOrders = require('./user/fetchOrders.js');
const FetchUserDetails = require('./user/fetchuserdetails.js');
const CreateOrder = require('./user/createOrder.js');
const DeleteOrder = require('./user/deleteOrder.js');
//auth
const Login = require('./Auth/login.js');
//general
const FetchAllProducts = require('./general/fetchProducts.js');
const ChangeState = require('./general/Changestate.js');
//payments
const PayOrder = require('./payments/payOrder.js');
const OrderPayVerification = require('./payments/payVerify.js');
const payout = require('./payments/payUser.js');

// Defined allowed origins (environment variables and static URLs)
const allowedOrigins = [process.env.ORIGIN_URL];

const corsOptns = {
  origin: (origin, callback) => {
    // Allow requests
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true); // Origin is allowed
    } else {
      callback(new Error('Not allowed by CORS')); // Block origin
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
  credentials: true, // Include credentials if needed
};

app.use(express.json());
app.use(bodyParser.json());
app.use(cors(corsOptns));
//app.use(generalLimiter);
app.use(express.static(path.join(__dirname,'dist')));

//app.use comps
app.use('/Api/fetchusers/data/main/server',GetUsers);
app.use('/Api/createuser/new/main/server',CreateUser);
app.use('/Api/deleteUser/delete/main/server',DeleteUser);
app.use('/Api/fetchuser/products/data/main/server',FetchProducts);
app.use('/Api/createproduct/new/main/server',CreateProduct);
app.use('/Api/deleteProduct/main/server',DeleteProduct);
app.use('/Api/fetch/orders/main/server',FetchOrders);
app.use('/Api/create/order/new/main/server',CreateOrder);
app.use('/Api/delete/order/main/server',DeleteOrder);
app.use('/Api/login/account/user/admin/main/server',Login);
app.use('/Api/fetch/All/products',FetchAllProducts);
app.use('/Api/payOrder/new/main/server',PayOrder);
app.use('/Api/verifyPay/new/main/server',OrderPayVerification);
app.use('/Api/change/exisiting/state/main/server',ChangeState);
app.use('/Api/get/user/details/main/server',FetchUserDetails);
app.use('/Api/initiate/user/payout/main/server',payout);


app.get('/', (req, res) => {
  res.status(200).send({msg:'LIVE'});
});


async function start() {
    if (db) {
        app.listen(port,()=>{
    });
    };
};

start();
