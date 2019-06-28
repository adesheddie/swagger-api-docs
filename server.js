var express = require('express');
var bodyparser = require('body-parser');
var app = express();
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: false }));
var crypto = require('crypto');
var cors = require('cors')
// app.use(cors());
app.options('*', cors());
// cors({credentials: true, origin: true});
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/ecom1');

app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Accept');
    next();
});

var userroutes = require('./server/routes/products_api.js');
app.use('/products', userroutes);


app.use('/', function (req, res) {

    res.send('Node is running here');
}).listen(3000);
console.log('Running at 3000');
