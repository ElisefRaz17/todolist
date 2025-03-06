const Todo = require('../models/todo');

// Function to get all expenses for a user
async function getAllTodos(req,res) {
    try {
        const todos = await Todo.find({
            user: req.user.id
        }).sort({ date: -1 });
        res.json(todos);
    } catch (err) {
        console.error(err.message);
        throw new Error('Server Error');
    }
}

// Function to add a new expense
async function addTodo(req,res) {
    const{ name, deadline, status,description} = req.body
    try {
        const newTodo = new Todo({
            name,
            deadline,
            description,
            status,
            user: req.user.id
        });

        const todo = await newTodo.save();
       res.status(201).json(todo)
    } catch (err) {
        console.log(err.message);
        throw new Error('Server Error');
    }
}

// Function to delete an expense
async function deleteTodo(todoId, userId) {
    try {
        let todo = await Todo.findById(todoId);

        if (!todo) {
            throw new Error('Todo not found');
        }

        // Check if user owns the expense
        if (todo.user.toString() !== userId) {
            throw new Error('Not authorized');
        }

        await todo.remove();
    } catch (err) {
        console.error(err.message);
        throw err;
    }
}

module.exports = { getAllTodos, addTodo, deleteTodo };
