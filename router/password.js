const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Admin = require('../models/admin');
const multer = require('multer');
const { verifyemail } = require('../controllers/email')
const bcrypt = require('bcryptjs');
const JWT = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');



router.get('/confirmation/:token', (req, res, next) => {
    res.header({'Content-Type':'text/html'});
    let token = req.params.token;
    try {
        const verified = JWT.verify(token, process.env.TOKEN_SECRET);
        let id = verified._id;
        User.findOneAndUpdate({ _id: id }, { $set: { "verified": true } })
            .then(val => {
                try {
                   let data = fs.readFileSync('pages/d.html', {encoding:"utf8"})
                      res.status(200).send(data)  
                } catch (err1) {
                    res.status(500).json({ message: { error: err1 } });

                }



            })
    } catch (error1) {
        res.status(500).json({ message: { error: error1 } });

    }

});

router.post("/reset",(req,res)=>{
    
})
module.exports = router;