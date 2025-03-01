require("dotenv").config();
const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId, Schema } = require("mongodb");
const mongoose = require("mongoose");
const app = express();
const cors = require("cors");
const { SchemaTypes } = require("mongoose");
const port = 5000;




mongoose.connect("mongodb://localhost/todo-list", {
    useUnifiedTopology: true,
    useNewUrlParser: true,
})

const userSchema = new mongoose.Schema({
    username: String,
    password: String,
}, { collection: 'users' });

const User = mongoose.model("User", userSchema);

const todosSchema = new mongoose.Schema({
    userId: mongoose.Schema.ObjectId,
    todos: [
        {
            status: String,
            deadline: String,
            description: String,
            name: String,
            _id: {
                type: SchemaTypes.ObjectId,
                default: () => new mongoose.Types.ObjectId()
            },
        },
    ],
}, { collection: 'todos' });
const Todos = mongoose.model("Todos", todosSchema);

app.use(cors());
app.use(express.json());

app.post("/register", async (req, res) => {
    const { username, password } = req.body
    const user = await User.findOne({ username }).exec()
    if (user) {
        res.status(500)
        res.json({ messgae: "user already exists" })
        return;
    }
    await User.create({ username, password })
    res.json({
        message: "success"
    })
})

app.post("/login", async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username }).exec();
    if (!user || user.password !== password) {
        res.status(403);
        res.json({
            message: "invalid login",
        });
        return;
    }
    res.json({
        message: "success",
    });
});

app.post("/todos", async (req, res) => {
    const { authorization } = req.headers;
    const [username, password] = authorization.split(":", 2);
    const todosItems = req.body;
    const user = await User.findOne({ username }).exec();

    if (!user || user.password !== password) {
        res.status(403);
        res.json({
            message: "invalid access",
        });
        return;
    }
    const todos = await Todos.findOne({ userId: user._id }).exec();
    if (!todos) {
        await Todos.create({
            userId: user._id,
            todos: todosItems,
        });
    } else {
        todos.todos = todosItems;
        await todos.save();
    }
    res.json(todosItems);
});

app.get("/todos", async (req, res) => {
    const { authorization } = req.headers;
    const [username, password] = authorization.split(":", 2);
    console.log('Todo Authorization',authorization)
    const user = await User.findOne({ username }).exec();
    if (!user || user.password !== password) {
        res.status(403);
        res.json({
            message: "invalid access",
        });
        return;
    }
    const { todos } = await Todos.findOne({ userId: user._id }).exec();
    res.json(todos);
});
app.delete('/todos/:id', async (req, res) => {
    // var { id } = req.params;
    const { authorization } = req.headers;
    console.log('Delete Authorization',authorization)
    const [username, password] = authorization.split(":", 2);
    const user = await User.findOne({ username }).exec();
    if (!user || user.password !== password) {
        res.status(403);
        res.json({
            message: "invalid access",
        });
        return;
    }
    try {
        // if (typeof id === 'string' && id.match(/^[0-9a-fA-F]{24}$/)) {
            // id = new mongoose.Types.ObjectId(id);
        // }
        const deletedTodo = await Todos.updateOne({},{'$pull':{'todos':{'_id':`${new mongoose.Types.ObjectId(req.params.id)}`}}},{multi:true})
        // const deletedTodo = await Todos.findOne({_id: new mongoose.Types.ObjectId(req.params.id)})
        if (!deletedTodo) {
            return res.status(404).send({ message: 'Todo not found' });
        }
        // await deletedTodo.remove()
        // res.json(deletedTodo)
        res.status(200).send({ message: 'Todo deleted successfully' });
    } catch (err) {
        res.status(400).send({ error: 'Error deleting Todo: ' + err.message });
    }
})
app.put('/todos/:id', async (req, res) => {
    const { id } = req.params;
    const { task, status } = req.body;

    try {
        const updatedTodo = await Todos.findByIdAndUpdate(id, { task, status }, { new: true, runValidators: true });
        if (!updatedTodo) {
            return res.status(404).send({ message: 'Todo not found' });
        }
        res.status(200).send(updatedTodo);
    } catch (err) {
        res.status(400).send({ error: 'Error updating Todo: ' + err.message });
    }
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
    app.listen(port, () => {
        console.log(`Example app listening at http://localhost:${port}`);
    });
});
/** Worked for register and login routes */
// const client = new MongoClient(process.env.MONGO_URL, {
//     serverApi: {
//         version: ServerApiVersion.v1,
//         strict: true,
//         deprecationErrors: true,
//     },
// });

// async function run() {
//     try {
//         // Connect to the MongoDB server
//         await client.connect();

//         // Access a specific database and collection
//         const database = client.db("todo-list");
//         const databaseCollection = database.collection("users");

//         // Define routes for CRUD operations
//         // ...
//         app.post('/register', async (req, res) => {
//             const data = req.body;
//             const { username } = req.body;
//             // const doc = {
//             //     username: data.username,
//             //     password: data.password
//             // };
//             try {
//                 const existingItem = await databaseCollection.findOne({ username });
//                 if (existingItem) {
//                     res.status(400).json({ message: 'User already exists' })

//                 } else {
//                     await databaseCollection.insertOne(req.body)
//                     res.status(201).json({ message: 'User added successfully' })
//                 }

//             } catch (error) {
//                 console.log('Error:', error)
//                 res.status(500).json({ message: 'Server error.' })
//             }
//         })
//         app.post('/todos', async(req,res)=>{
//             // const database = client.db("todo-list");
//             // const databaseCollection = database.collection("todoItems");
//             // const {userId,status,deadline,name,description} = req.body
//             const todoItems = req.body
//             const user = await User.findOne({username}).exec()
//             if(!user || user.password !== password){
//                 res.status(403)


//             }
//         })
//         app.post('/login', async(req,res)=>{
//             const {username,password} = req.body
//             try{
//                await databaseCollection.findOne({username:username}).then(user=> {
//                     if(user){
//                         if(user.password === password){
//                             res.json("Success")
//                             console.log(user._id)
//                         }else{
//                             res.json("The password is incorrect")
//                         }
//                     }else{
//                         res.json("No user exists")
//                     }
//                 })
//             }catch(error){
//                 console.log('Errpr:', error)
//                 res.status(500).json({ message: 'Server error.' })
//             }
//         })

//     } finally {
//         // Close the MongoDB client when done
//     }
// }
// run().catch(console.dir);

// app.listen(port, () => {
//     console.log(`Server is running on port: ${port}`);
// });