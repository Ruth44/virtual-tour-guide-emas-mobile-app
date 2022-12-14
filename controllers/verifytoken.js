const req = require('express/lib/request')
const res = require('express/lib/response')
const jwt = require('jsonwebtoken')
const config = require('../config')

async function verfyToken(req, res, next){
    const token = req.headers['x-access-token'];
    if(!token){
        return res.status(401).send({auth:false, message:'No token provided'})
    }
    const decoded = await jwt.verify(token , config.secret)
    req.userId = decoded.indexOf;

    next();
}

module.exports = verfyToken