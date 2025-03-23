// config.js

const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect(`${proccess.env['MONGO_URI']}`, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Failed to connect to MongoDB:', error);
    }
};

module.exports = {
    mongoURI: process.env.MONGO_URI || `${proccess.env['MONGO_URI']}`,
    jwtSecret: process.env.JWT_SECRET || 'secret',
    email: {
        host: process.env.EMAIL_HOST || 'frazier.elise07@gmail.com',
        port: process.env.EMAIL_PORT || 587,
        user: process.env.EMAIL_USER || 'frazier.elise07@gmail.com',
        pass: process.env.EMAIL_PASS || 'iEtmuRFEbTpTWxrX'
    },
    connectDB,
};
