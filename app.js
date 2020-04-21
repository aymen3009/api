process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
const express = require('express');
const app = express();
const morgan = require('morgan');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const user = require('./router/users')
const blockchain = require('./router/blockchain');
const pass = require('./router/password');

dotenv.config();
app.set("view engine", "ejs");


mongoose.connect(process.env.DB_DOC,
    { useNewUrlParser: true, useFindAndModify: false  , useUnifiedTopology: true,useCreateIndex: true },
    (err) =>{
    if(err) console.log(err);
     else
    console.log('connected to db!!')}
);
mongoose.Promise = global.Promise ;
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json());
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    next();
});
app.use('/users',user);
app.use('/password',pass);
app.use('/uploads',express.static('uploads'))
app.use('/bc',blockchain);
app.use((req, res, next) => {
    const error = new Error('Not found');
    error.name= 404;
    next(error);
});



app.use((error, req , res, next) => {
    res.status(error.name || 500);
    console.log(req);
    res.json({
        error:
        {
            
            
            message: error.message
        }
    })
});
module.exports = app;