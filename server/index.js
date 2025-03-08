// const mongoose = require('mongoose')

// // Connection URI
// const mongoURI = 'mongodb://localhost/todo-list'//localhost:27017/yourDatabaseName’; // For local MongoDB// Or use your MongoDB Atlas URI// const mongoURI = 'yourAtlasConnectionURI’;

// mongoose.connect(mongoURI, {  useNewUrlParser: true,  useUnifiedTopology: true,});

// mongoose.connection.on('connected', () => {  console.log('Connected to MongoDB');})

// mongoose.connection.on('error', (err) => {  console.error(`Error connecting to MongoDB: ${err}`);});

// app.js

const express = require('express');
const { connectDB } = require('./config/config.js'); // Import connectDB from config.js
const errorHandler = require('./utils/errorHandler.js');
const authRoutes = require('./routes/authRoutes.js');
const todoRoutes = require('./routes/todoRoutes.js');
const cors = require('cors')

// Initialize Express app
const app = express();

// Connect to MongoDB
connectDB(); // Call connectDB function

// Middleware
app.use(express.json());
app.use(cors())

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/todos', todoRoutes);

// Error handler middleware
app.use(errorHandler);

// Define port
const PORT = process.env.PORT || 5000;

// Start server
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});