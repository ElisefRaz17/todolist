const Todo = require('../models/todo');

/** Older routes were allowing any user to retrieve todos thare created */
// Function to get all expenses for a user
// async function getAllTodos(req,res) {
//     try {
//         const todos = await Todo.find({
//             user: req.user.id
//         }).sort({ date: -1 });
//         res.json(todos);
//     } catch (err) {
//         console.error(err.message);
//         throw new Error('Server Error');
//     }
// }

// // Function to add a new expense
// async function addTodo(req,res) {
//     const{ name, deadline, status,description,user} = req.body
//     try {
//         const newTodo = new Todo({
//             name,
//             deadline,
//             description,
//             status,
//             user
//         });

//         const todo = await newTodo.save();
//        res.status(201).json(todo)
//     } catch (err) {
//         console.log(err.message);
//         throw new Error('Server Error');
//     }
// }


// //Function to update a todo


// // Function to delete an expense
// async function deleteTodo(todoId, userId) {
//     try {
//         let todo = await Todo.findById(todoId);

//         if (!todo) {
//             throw new Error('Todo not found');
//         }

//         // Check if user owns the expense
//         if (todo.user.toString() !== userId) {
//             throw new Error('Not authorized');
//         }

//         await todo.remove();
//     } catch (err) {
//         console.error(err.message);
//         throw err;
//     }
// }

// module.exports = { getAllTodos, addTodo, deleteTodo };

/** new routes to create */
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

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