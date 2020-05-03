const express = require('express');
const router = express.Router();
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const JWT = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const fs = require('fs');

const transporte = nodemailer.createTransport({
    host: 'mail.welcomedjerba.tn',
    port: 587,
    secure: false,
    auth: {
        user: 'norepaly@welcomedjerba.tn',
        pass: 'Timoux1997?'
    },
    tls: {
        rejectUnauthorized: false,
    }
});

router.get('/confirmation/:token', (req, res, next) => {
    res.header({ 'Content-Type': 'text/html' });
    let token = req.params.token;
    try {
        const verified = JWT.verify(token, process.env.TOKEN_SECRET);
        let id = verified._id;
        User.findOneAndUpdate({ _id: id }, { $set: { "verified": true } })
            .then(val => {
                try {
                    let data = fs.readFileSync('pages/d.html', { encoding: "utf8" })
                    res.status(200).send(data)
                } catch (err1) {
                    res.status(500).json({ message: { error: err1 } });

                }



            })
    } catch (error1) {
        res.status(500).json({ message: { error: error1 } });

    }

});
router.get("/forget", (req, res) => {
    res.header({ 'Content-Type': 'text/html' });
    try {
        let data = fs.readFileSync('pages/forget.ejs', { encoding: "utf8" })
        res.status(200).send(data)
    } catch (err1) {
        res.status(500).json({ message: { error: err1 } });

    }
})

router.post("/forget", async (req, res) => {

    const { email } = req.body;
    console.log(email);

    const user = await User.findOne({ email: email });

    if (!user || !user._id) return res.status(400).json({ message: { error: "Email does not exist" } });
    try {
        JWT.sign({ _id: user._id }, user.password, { expiresIn: '1d' }, (err, emailToken) => {
            const urll = `http://192.168.100.50:${process.env.PORT}/password/reset/${emailToken}/${user._id}`;
            transporte.sendMail({
                from: '"DUVoS TEAM " <norepaly@welcomedjerba.tn>',
                to: req.body.email,
                subject: 'Rest Password For Your DUVoS Account',
                html: `We heard that you lost your DUVoS password. Sorry about that! \n \n
            But don’t worry! You can use the following link to reset your password:\n\n <a href="${urll}">${urll}</a>`,
            }, (errr, info) => {
                if (errr) {
                    console.log(errr);
                    return res.status(400).json({ message: { error: errr } });

                }
                console.log(info);
                return res.status(201).json({ message: "Check you Email" });
            })
        }

        );
    } catch (err) {
        return res.status(400).json({ message: { error: err } });
    }

})

router.get("/reset/:token/:id", async (req, res) => {
    const id = req.params.id;
    const token = req.params.token;

    let user = await User.findOne({ _id: id });
    if (!user || !user._id) res.status(404).json({ message: "user does not found" });
    try {
        const verified = JWT.verify(token, user.password)

    } catch (error) {
        return res.status(401).json({ message: "Token Expired" })
    }
    res.render('reset', { token: req.params.token, id: id });

})

router.post("/reset/:token/:id", async (req, res) => {


    const id = req.params.id;
    const token = req.params.token;


    let user = await User.findOne({ _id: id });
    if (!user || !user._id) res.status(404).json({ message: "user does not found" });

    const verified = JWT.verify(token, user.password)
    console.log(verified);
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(req.body.password, salt);

    try {
        User.findOneAndUpdate({ _id: id }, { "password": hashed })
            .then(r => {

                res.status(200).json({ message: "ok nayek" })
            }
            )
            .catch(err => res.status(500).json({ message: { error: err } }));



    } catch (err) {
        res.status(500).json({ message: { error: "err" } })
    }
})
module.exports = router;