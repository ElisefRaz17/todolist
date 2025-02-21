require("dotenv").config();
const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const app = express();
const cors = require("cors");
const port = 5000;

app.use(cors());
app.use(express.json());

const client = new MongoClient(process.env.MONGO_URL, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    },
});

async function run() {
    try {
        // Connect to the MongoDB server
        await client.connect();

        // Access a specific database and collection
        const database = client.db("todo-list");
        const databaseCollection = database.collection("users");

        // Define routes for CRUD operations
        // ...
        app.post('/register', async (req, res) => {
            const data = req.body;
            const { username } = req.body;
            // const doc = {
            //     username: data.username,
            //     password: data.password
            // };
            try {
                const existingItem = await databaseCollection.findOne({ username });
                if (existingItem) {
                    res.status(400).json({ message: 'User already exists' })

                } else {
                    await databaseCollection.insertOne(req.body)
                    res.status(201).json({ message: 'User added successfully' })
                }

            } catch (error) {
                console.log('Error:', error)
                res.status(500).json({ message: 'Server error.' })
            }
        })
        app.post('/addTodo', async(req,res)=>{
            const database = client.db("todo-list");
            const databaseCollection = database.collection("todoItems");
            const {userId,status,deadline,name,description} = req.body
            try{
                const existingItem = await databaseCollection.findOne({name})
                if(existingItem){
                    res.status(400).json({ message: 'Todo item already exists' })
                    
                }else{
                    await databaseCollection.insertOne(req.body)
                    res.status(201).json({message:'Todo Item created successfully'})
                }
            
            }catch(error){
                console.log("Error:",error)
                res.status(500).json({message:'Server error.'})
            }
        })
        app.post('/login', async(req,res)=>{
            const {username,password} = req.body
            try{
               await databaseCollection.findOne({username:username}).then(user=> {
                    if(user){
                        if(user.password === password){
                            res.json("Success")
                            console.log(user._id)
                        }else{
                            res.json("The password is incorrect")
                        }
                    }else{
                        res.json("No user exists")
                    }
                })
            }catch(error){
                console.log('Errpr:', error)
                res.status(500).json({ message: 'Server error.' })
            }
        })

    } finally {
        // Close the MongoDB client when done
    }
}
run().catch(console.dir);

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});