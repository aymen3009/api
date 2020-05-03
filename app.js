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
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerui = require('swagger-ui-express');

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
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept,auth-token');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    next();
});

const swaggerOptions = {
    swaggerDefinition: {
        info:{
            title:"DUVoS REST API ",
            description:"The rest api for the DUVoS mobile app and web platform ",
            contact :{
                name :"DUVoS Team "
            },
            servers:["http://192.168.100.51:3300"]
        }
    },
    apis:["app.js","./router/*.js"]
};
const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api-doc',swaggerui.serve,swaggerui.setup(swaggerDocs));
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