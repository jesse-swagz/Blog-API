require("dotenv").config({path: './config.env'});
const jwt = require('jsonwebtoken')


const token_verification = (req,res,next) => {
    const token  = req.body.token || req.query.token || req.headers["x-access-token"]
    // console.log(token)
    if(!token){
        res.status(403).json({
            message: 'A token is required for authentication'
        })
        return;
    }
    try{
        const decoded = jwt.verify(token,process.env.TOKEN_KEY)
        req.user = decoded
    }catch(err){
        res.status(401).json({
            message: 'Invalid token',
            err: err
        })
    }
    return next()
}



module.exports = token_verification