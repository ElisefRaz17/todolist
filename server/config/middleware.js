// // middleware.js

// const jwt = require('jsonwebtoken');
// const config = require('./config');

// // Middleware function to verify JWT token
// function verifyToken(req, res, next) {
//     // Get token from header
//     const token = req.header('Authorization');

//     // Check if token is present
//     if (!token) {
//         return res.status(401).json({
//             msg: 'No token, authorization denied'
//         });
//     }

//     try {
//         // Verify token
//         const decoded = jwt.verify(token, config.jwtSecret);

//         // Add user from payload
//         req.user = decoded;
//         next();
//     } catch (err) {
//         return res.status(401).json({ msg: 'Token is not valid' });
//     }
// }

// module.exports = verifyToken;
const jwt = require('jsonwebtoken');
const config = require('./config');
    
const auth = (req, res, next) => {
  const token = req.header('Authorization');
  if (!token) {
    return res.status(401).send({ message: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, config.jwtSecret);
    req.user = decoded;
    next();
  } catch (ex) {
    res.status(400).send({ message: 'Invalid token.' });
  }
};

module.exports = auth;