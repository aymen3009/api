const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Admin = require('../models/admin');
const multer = require('multer');
const { verifyemail } = require('../controllers/email')
const bcrypt = require('bcryptjs');
const JWT = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const axios = require('axios').default;
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, new Date().toISOString() + file.originalname);
    }
});
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        cb(null, false);
    }
};
const transporter = nodemailer.createTransport({
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
const upload = multer({ storage: storage, fileFilter: fileFilter })

const verify_JWT = require('../validation/verifyToken')
const { registerValidation, loginValidation } = require('../validation/user')

router.post('/register', async (req, res) => {

    const { error } = registerValidation(req.body);
    if (error) return res.status(400).json(error)

    const student = verifyemail(req.body.email, req.body.cin)
    if (!student.id || !student) return res.status(403).json({ message: "Unauthorized email address" });
    const exist = await User.findOne({ email: req.body.email })
    if (exist) return res.status(422).json({ message: { error: 'Email already exists' } });

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(req.body.password, salt);




    const user = new User({
        cin: req.body.cin,
        email: req.body.email,
        password: hashed,
        profileURL: "",
        studentid: student.id
    });
    let url = 'http://192.168.100.50:8000/student/create';
    let obj = {
        id: student.id,
        cin: student.cin,
        name: student.name,
        cind: student.cind,
        degree: student.degree,
        classe: student.classe,
        bdate: student.bdate
    }

    try {
        axios.post(url, obj)
            .then(async response => {
                try {


                    const savedUser = await user.save();
                    JWT.sign({ _id: savedUser._id }, process.env.TOKEN_SECRET, { expiresIn: '1d' }, (err, emailToken) => {
                        const urll = `http://192.168.100.50:${process.env.PORT}/password/confirmation/${emailToken}`;
                        transporter.sendMail({
                            from: '"DUVoS TEAM " <norepaly@welcomedjerba.tn>',
                            to: req.body.email,
                            subject: 'Confirm Email For Your DUVoS Account',
                            html: `Please click this email to confirm your email: <a href="${urll}">${urll}</a>`,
                        }, (errr, info) => {
                            if (errr) {
                                console.log(errr);
                                return res.status(400).json({ message: { error: errr } });

                            }
                            console.log(info);
                            return res.status(201).json({ user: savedUser._id });
                        })
                    }

                    );
                } catch (err) {
                    return res.status(400).json({ message: { error: err } });
                }
            })
            .catch(err => {
                return res.status(500).json({ message: { error: err } });

            })

    } catch (err) {
        return res.status(400).json({ message: { error: err } });

    }






});

router.post('/login', async (req, res) => {
    const { error } = loginValidation(req.body);
    if (error) return res.status(400).send(error);

    const exist = await User.findOne({ email: req.body.email });
    if (!exist) return res.status(400).json({ message: { error: 'Email or password is incorrect' } })

    if(!exist.verified) return res.status(400).json({message : "Please verify your Email"});
    const validPass = await bcrypt.compare(req.body.password, exist.password);
    if (!validPass) return res.status(400).json({ message: { error: 'Email or password is incorrect' } })
    //JWt
    const token = JWT.sign({ _id: exist._id, type: "user" }, process.env.TOKEN_SECRET);
    res.status(200).json({ token: token })

});

router.patch('/', verify_JWT, async (req, res, next) => {
    try {
        const id = req.user._id;
        const salt = await bcrypt.genSalt(10);
        const hashed = await bcrypt.hash(req.body.newpassword, salt);
        User.findOneAndUpdate({ _id: id }, { "password": hashed })
            .then(res.status(200).json({ message: req.user }))
            .catch(err => res.status(500).json({ message: { error: err } }))

    } catch (err) {
        res.status(500).json({ message: { error: err } })
    }
}
);

router.post('/profile', verify_JWT, upload.single('profilePic'), (req, res, next) => {
    try {
        const id = req.user._id;
        User.findOneAndUpdate({ _id: id }, { "profileURL": req.file.path })
            .then(
                res.status(200).json({ profileURL: `http://192.168.100.50:${process.env.PORT}/` + req.file.path })
            )
            .catch(err => res.status(500).json({ message: { error: err } }));
    } catch (err) {
        console.log(err);

        res.status(500).json({ message: { error: err } })
    }



});

router.post('/admin', async (req, res) => {
    const { error } = loginValidation(req.body);
    if (error) return res.status(400).send(error);

    const exist = await Admin.findOne({ email: req.body.email });
    if (!exist) return res.status(400).json({ message: { error: 'Email or password is incorrect' } })

    const validPass = await bcrypt.compare(req.body.password, exist.password);
    if (!validPass) return res.status(400).json({ message: { error: 'Email or password is incorrect' } })
    //JWt
    const token = JWT.sign({ _id: exist._id, type: "admin" }, process.env.TOKEN_SECRET);
    res.json({ _id: exist._id, token: token });
});

router.patch('/admin', verify_JWT, async (req, res, next) => {
    try {
        const id = req.user._id;
        const salt = await bcrypt.genSalt(10);
        const hashed = await bcrypt.hash(req.body.newpassword, salt);
        Admin.findOneAndUpdate({ _id: id }, { "password": hashed })
            .then(res.status(200).json({}))
            .catch(err => res.status(500).json({ message: { error: err } }))

    } catch (err) {
        res.status(500).json({ message: { error: err } })
    }
}
);
router.post('/admin/profile', upload.single('profilePic'), (req, res, next) => {
    try {
        const id = req.user._id;
        Admin.findOneAndUpdate({ _id: id }, { "profileURL": req.file.path })
            .then(r => {
                res.status(200).json({ profileURL: `http://192.168.100.50:${process.env.PORT}/` + req.file.path })
            })
            .catch(err => res.status(500).json({ message: { error: err } }));
    } catch (err) {
        console.log(err);

        res.status(500).json({ message: { error: err } })
    }
});

const Astorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './data/');
    },
    filename: function (req, file, cb) {
        cb(null, "data.json");
    }
});
const AfileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpegapplication/json') {
        cb(null, true);
    } else {
        cb(null, false);
    }
};
const Aupload = multer({ storage: Astorage, fileFilter: AfileFilter })

const admin_JWT = require('../validation/adminjwt')



router.post('/admin/add', async (req, res) => {
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(req.body.password, salt);
    const admin = new Admin({
        email: req.body.email,
        password: hashed
    });
    console.log(hashed, admin);

    let cadmin = await admin.save()
    console.log(cadmin);

    res.status(201).json({ created: "yes", cadmin });
})


router.get("/test",(req,res)=>{
    res.render('reset');
})



module.exports = router;