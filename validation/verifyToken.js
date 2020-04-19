const Jwt = require('jsonwebtoken');

module.exports = function (req,res,next){
    const token = req.header('auth-token');
    if(!token) return res.status(401).send('Access Denied');
    try {
        const verified = Jwt.verify(token, process.env.TOKEN_SECRET);
        if(req.user.type !== "user" ) return res.status(403).json({});
        req.user = verified;
        next();
    } catch (error) {
       res.status(401).send('Invalid Token') ;
    }
}