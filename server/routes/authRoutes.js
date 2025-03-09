// // authRoutes.js

// const express = require('express');
// const router = express.Router();
// const { body } = require('express-validator');
// const authController = require('../controllers/authController');
// const verifyToken = require('../config/middleware');

// // Route: POST /api/auth/register
// // Description: Register a new user
// router.post('/register', [
//     body('username', 'Username is required').notEmpty(),
//     body('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 })
// ], authController.register);

// // Route: POST /api/auth/login
// // Description: Authenticate user & get token (login)
// router.post('/login', [
//     body('username', 'Please include a valid username').notEmpty(),
//     body('password', 'Password is required').exists()
// ], authController.login);

// // Route: GET /api/auth/user
// // Description: Get user data (protected route)
// router.get('/user', verifyToken, authController.getUser);

// module.exports = router;

const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const config = require('../config/config')

router.post('/register', async (req, res) => {
  const { username, password } = req.body;
  const user = new User({ username, password });
  await user.save();
  res.status(201).send({ message: 'User created successfully' });
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user || !await user.isValidPassword(password)) {
    return res.status(401).send({ message: 'Invalid credentials' });
  }
  const token = jwt.sign({ _id: user._id }, config.jwtSecret);
  res.send({ token });
});

module.exports = router;