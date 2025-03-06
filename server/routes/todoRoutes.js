const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const todoController = require('../controllers/todoController');
const verifyToken = require('../config/middleware');

// Route: GET /api/expenses
// Description: Get all expenses
router.get('/', verifyToken, todoController.getAllTodos);

// Route: POST /api/expenses
// Description: Add a new expense
router.post('/', verifyToken, [
    body('name', 'Name is required').notEmpty(),
    body('status', 'Status is required').notEmpty(),
    body('deadline', 'Deadline is required').notEmpty(),
    body('description', 'Description is required').notEmpty()
], todoController.addTodo);

// Route: DELETE /api/expenses/:id
// Description: Delete an expense
router.delete('/:id', verifyToken, todoController.deleteTodo);

module.exports = router;
