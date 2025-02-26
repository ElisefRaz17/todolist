const mongoose = require('mongoose')

const todosSchema = new mongoose.Schema({
    userId: mongoose.Schema.ObjectId,
    todos: [
      {
        name: "",
        deadline: "",
        status:"",
        description:"",
        id: String,
      },
    ],
  });
  const Todos = mongoose.model("Todos", todosSchema);
export default Todo;