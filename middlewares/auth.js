require('express')
const jwt = require('jsonwebtoken')
const config = require('../config');

const isAuthenticated = async(req, res, next) => {
    try {
      const token = req.headers.authorization.split(' ')[1];
        if (!token) {
          return res.status(403).json({
              message: 'Invalid Authentication Credentials, token not provided',
              error: true
            });
        }
        const decoded = jwt.verify(token, config.secret)
        
        const user = await User.findById(decoded.id)
        if (!user) {
            return res.status(403).json({
              message: 'Invalid Authentication Credentials, user doesn\'t exist',
              error: true
            })
          }
          
        // req.locals.userId = user.id;
        req.userId = user.id;
        return next();

    } catch(error) {
      console.log("error " + error);
        return res.status(403).json({
            message: 'Invalid Authentication Credentials',
            error: true
          })
    }


}

const authMiddleware = {
  isAuthenticated,
}

module.exports = authMiddleware;
