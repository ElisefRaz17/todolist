

const mongoose = require('mongoose');

const TodoSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  deadline: {
    type: String,
    required: true
  },
  status: {
    type: String,
    required: true
  },
  description:{
    type:String,
    required:true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

const Todo = mongoose.model('Todo', TodoSchema);

module.exports = Todo;