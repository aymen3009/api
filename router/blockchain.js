const express = require('express');
const router = express.Router();
const axios = require('axios').default;
const verify_JWT = require('../validation/verifyToken');
const admin_JWT = require('../validation/adminjwt');
const basic_JWT = require('../validation/adminjwt');
const baseUrl = 'http://192.168.100.50:8000/student/';


router.get("/getstudent/:id", basic_JWT, (req, res, next) => {
    let id = req.params.id;
    try {
        let url = 'http://192.168.100.50:8000/student/get/' + id
        axios.get(url)
            .then(response => {
                return res.status(200).send(response.data);
            })
            .catch(err => {
                return res.status(500).send(err);
            })

    } catch (err0) {
        return res.status(400).send(err0);

    }


});

router.get('/getallelection',basic_JWT,  (req, res, next) => {
    try {
        let url = baseUrl + 'getallElection'
        axios.get(url)
            .then(response => {

                return res.status(200).send(response.data);
            })
    } catch (err) {
        return res.status(400).send(err);

    }
});

router.get('/getallstudent', basic_JWT, (req, res, next) => {
    try {
        let url = baseUrl + 'getallStudent';
        axios.get(url).then(response => {
            return res.status(200).send(response.data);
        })
    } catch (err) {
        return res.status(400).send(err);

    }
});
router.get('/getallcondidate', basic_JWT, (req, res, next) => {
    try {
        let url = baseUrl + 'getallcondidate';
        axios.get(url).then(response => {
            return res.status(200).send(response.data);
        })
    } catch (err) {
        return res.status(400).send(err);

    }
});
router.get('/getallsurv', basic_JWT, (req, res, next) => {
    try {
        let url = baseUrl + 'getallsurv';
        axios.get(url).then(response => {
            return res.status(200).send(response.data);
        })
    } catch (err) {
        return res.status(400).send(err);

    }
});
router.get('/getcandidate/:id', basic_JWT, (req, res, next) => {
    let id = req.params.id
    try {
        let url = baseUrl + 'getcandidate/' + id;
        axios.get(url).then(response => {
            return res.status(200).send(response.data);
        })
    } catch (err) {
        return res.status(400).send(err);

    }
});
router.get('/getmyelections/:id', basic_JWT, (req, res, next) => {
    let id = req.params.id
    try {
        let url = baseUrl + 'getmyelections/' + id;
        axios.get(url).then(response => {
            return res.status(200).send(response.data);
        })
    } catch (err) {
        return res.status(400).send(err);

    }
});
router.get('/getmysurvs/:id', basic_JWT, (req, res, next) => {
    let id = req.params.id
    try {
        let url = baseUrl + 'getmysurvs/' + id;
        axios.get(url).then(response => {
            return res.status(200).send(response.data);
        })
    } catch (err) {
        return res.status(400).send(err);

    }
});
router.post('/addcondidate', verify_JWT, (req, res, next) => {

    try {
        let obj = {
            id: req.id,
            id1: req.id1,
            party: req.party,

        }
        let url = baseUrl + 'addcondidate';
        axios.post(url, obj).then(response => {
            return res.status(200).send(response.data);
        })
    } catch (err) {
        return res.status(400).send(err);

    }
});
router.delete('/dnomination', verify_JWT, (req, res, next) => {
    try {
        let obj = {
            ide: req.ide,
            ids: req.ids


        }
        let url = baseUrl + 'dnomination';
        axios.post(url, obj).then(response => {
            return res.status(200).send(response.data);
        })
    } catch (err) {
        return res.status(400).send(err);

    }
});
router.post('/vote', verify_JWT, (req, res, next) => {
    try {
        let obj = {
            id: req.id,
            ids: req.ids,
            ide: req.ide


        }
        let url = baseUrl + 'vote';
        axios.post(url, obj).then(response => {
            return res.status(200).send(response.data);
        })
    } catch (err) {
        return res.status(400).send(err);

    }
});
router.post('/votesur', verify_JWT, (req, res, next) => {
    try {
        let obj = {
            id: req.id,
            ids: req.ids,
            ide: req.ide


        }
        let url = baseUrl + 'votesur';
        axios.post(url, obj).then(response => {
            return res.status(200).send(response.data);
        })
    } catch (err) {
        return res.status(400).send(err);

    }
});
router.post('/addelection', admin_JWT, (req, res, next) => {
    try {


        let obj = {
            desc: req.desc,
            name: req.name,
            degree: req.degree,
            sd: req.sd,
            fd: req.fd,
            dns: req.dns,
            ns: req.ns,
            nf: req.nf,
            dnf: req.dnf,
            mvps: req.mvps,
            sender: req.sender
        }
        let url = baseUrl + 'addelection';
        axios.post(url, obj).then(response => {
            return res.status(200).send(response.data);
        })
    } catch (err) {
        return res.status(400).send(err);

    }
});
router.post('/addsurv', basic_JWT, (req, res, next) => {
    try {


        let obj = {
            desc: req.desc,
            name: req.name,
            choices: req.choices,
            sd: req.sd,
            fd: req.fd,
            vnumb: req.vnumb,
            idst: req.idst
        }
        let url = baseUrl + 'addsurv';
        axios.post(url, obj).then(response => {
            return res.status(200).send(response.data);
        })
    } catch (err) {
        return res.status(400).send(err);

    }
});
router.delete('/removeone', basic_JWT, (req, res, next) => {
    try {


        let obj = {
            id: req.id,
            idst: req.idst
        }
        let url = baseUrl + 'removeone';
        axios.post(url, obj).then(response => {
            return res.status(200).send(response.data);
        })
    } catch (err) {
        return res.status(400).send(err);

    }
});
router.delete('/removelection', admin_JWT, (req, res, next) => {
    try {


        let obj = {
            id: req.id
        }
        let url = baseUrl + 'removelection';
        axios.post(url, obj).then(response => {
            return res.status(200).send(response.data);
        })
    } catch (err) {
        return res.status(400).send(err);

    }
});
module.exports = router;
