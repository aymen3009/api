const Jwt = require('jsonwebtoken');

module.exports = function (req,res,next){
    const token = req.header('auth-token');
    if(!token) return res.status(401).json({message:{error:'Access Denied'}});
    try {
        const verified = Jwt.verify(token, process.env.TOKEN_SECRET);
        req.user = verified;
        if(req.user.type !== "admin" ) return res.status(403).json({});
        next();
    } catch (error) {
       res.status(400).json({message:{error:'Invalid Token'}}) ;
    }
}