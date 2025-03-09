// const express = require('express');
// const router = express.Router();
// const { body } = require('express-validator');
// const todoController = require('../controllers/todoController');
// const verifyToken = require('../config/middleware');

// // Route: GET /api/expenses
// // Description: Get all expenses
// router.get('/', verifyToken, todoController.getAllTodos);

// // Route: POST /api/expenses
// // Description: Add a new expense
// router.post('/', verifyToken, [
//     body('name', 'Name is required').notEmpty(),
//     body('status', 'Status is required').notEmpty(),
//     body('deadline', 'Deadline is required').notEmpty(),
//     body('description', 'Description is required').notEmpty()
// ], todoController.addTodo);

// // Route: DELETE /api/expenses/:id
// // Description: Delete an expense
// router.delete('/:id', verifyToken, todoController.deleteTodo);

// module.exports = router;
const express = require('express');
const router = express.Router();
const Todo = require('../models/todo');
const auth = require('../config/middleware');

router.post('/', auth, async (req, res) => {
  const todo = new Todo({ ...req.body, user: req.user._id });
  await todo.save();
  res.status(201).send(todo);
});

router.get('/', auth, async (req, res) => {
    const todos = await Todo.find({ user: req.user._id });
    res.send(todos);
});

router.put('/:id', auth, async (req, res) => {
    const todo = await Todo.findOneAndUpdate({ _id: req.params.id, user: req.user._id }, req.body, { new: true });
    if (!todo) {
        return res.status(404).send({ message: 'Todo not found' });
    }
    res.send(todo);
});

router.delete('/:id', auth, async (req, res) => {
    const todo = await Todo.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!todo) {
        return res.status(404).send({ message: 'Todo not found' });
    }
    res.send({ message: 'Todo deleted' });
});

module.exports = router;