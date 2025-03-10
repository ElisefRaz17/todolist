// // authController.js

// const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');
// const config = require('../config/config');
// // const User = require('../src/models/user.js');
// const User = require('../models/user');

// // Controller function for user registration
// async function register(req, res) {
//     const { username, password } = req.body;

//     try {
//         // Check if user already exists
//         let user = await User.findOne({ username });
//         if (user) {
//             return res.status(400).json({
//                 msg: 'User already exists'
//             });
//         }

//         // Create new user
//         user = new User({ username, password });

//         // Hash password
//         const salt = await bcrypt.genSalt(10);
//         user.password = await bcrypt.hash(password, salt);

//         // Save user to database
//         await user.save();

//         res.status(201).json({
//             msg: 'User registered successfully'
//         });
//     } catch (err) {
//         console.error(err.message);
//         res.status(500).send('Server Error');
//     }
// }

// // Controller function for user login
// async function login(req, res) {
//     const { username, password } = req.body;

//     try {
//         // Check if user exists
//         let user = await User.findOne({ username });
//         if (!user) {
//             return res.status(400).json({
//                 msg: 'Invalid credentials'
//             });
//         }

//         // Check password
//         const isMatch = await bcrypt.compare(password, user.password);
//         if (!isMatch) {
//             return res.status(400).json({
//                 msg: 'Invalid credentials'
//             });
//         }

//         // Generate JWT token
//         const payload = {
//             user: {
//                 _id: user._id
//             }
//         };

//         jwt.sign(payload, config.jwtSecret, {
//             expiresIn: '1h'
//         }, (err, token) => {
//             if (err) throw err;
//             res.json({ token });
//         });
//     } catch (err) {
//         console.error(err.message);
//         res.status(500).send('Server Error');
//     }
// }
// async function getUser(req,res) {
//     try {
//         // Fetch user data based on the user ID from the token
//         const user = await User.findOne(req.params.id).select('-password');
//         res.json(user);
//     } catch (err) {
//         console.error(err.message);
//         res.status(500).send('Server Error');
//     }
// }

// module.exports = { register, login, getUser };
