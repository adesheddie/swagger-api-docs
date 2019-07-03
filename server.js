var express = require('express');
var bodyparser = require('body-parser');
var router=express.Router();
var app = express();
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: false }));
var crypto = require('crypto');
var cors = require('cors')
// app.use(cors());
app.options('*', cors());
// cors({credentials: true, origin: true});
var mongoose = require('mongoose');
// mongoose.connect('mongodb://localhost/ecom1');
mongoose.connect('mongodb://adesheddie:gaming619*@ds147207.mlab.com:47207/products');

app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Accept');
    next();
});

var userroutes = require('./server/routes/products_api.js');
app.use('/products', userroutes);


var swaggerUi = require('swagger-ui-express'),
    swaggerDocument = require('./openapi.json');

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/api', router);


app.use('/', function (req, res) {

    res.send('Node is running here');
});
app.listen(process.env.PORT || 3000);
console.log('Running at 3000');
