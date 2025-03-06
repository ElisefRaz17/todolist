const Todo = require('../models/todo');

// Function to get all expenses for a user
async function getAllTodos(userId) {
    try {
        const todos = await Todo.find({
            user: userId
        }).sort({ date: -1 });
        return todos;
    } catch (err) {
        console.error(err.message);
        throw new Error('Server Error');
    }
}

// Function to add a new expense
async function addTodo(name, deadline, status,description, userId) {
    try {
        const newTodo = new Todo({
            name,
            deadline,
            description,
            status,
            user: userId
        });

        const todo = await newTodo.save();
        return todo;
    } catch (err) {
        console.error(err.message);
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
