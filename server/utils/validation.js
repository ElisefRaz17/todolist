// validation.js

const { body } = require('express-validator');

// Validation rules for user registration
const registerValidationRules = () => {
    return [
        body('username', 'Username is required').notEmpty(),
        body('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 })
    ];
};

// Validation rules for user login
const loginValidationRules = () => {
    return [
        body('username', 'Please include a valid username').notEmpty(),
        body('password', 'Password is required').exists()
    ];
};

module.exports = { registerValidationRules, loginValidationRules };
