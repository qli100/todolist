const express = require('express');                     // Nodejs web app framework for server & APIs
const mongoose = require('mongoose');                   // for schemas and models
const dotenv = require('dotenv').config();
const cors = require('cors');                           // to allow req from React app to Exp server
                                                        // bc Exp app served from diff domain than Exp serv
                                                        // (localhost:3000 => localhost:5500)
const app = express();
app.use(express.json());
app.use(cors());
const PORT = process.env.PORT || 5500;

const TodoItemRoute = require('./routes/todoItems');    // import routes defined for TodoItem API

mongoose.connect(process.env.DB_CONNECT)                // connect to mongodb
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.log(err))

app.use('/', TodoItemRoute);                            // when user visits root URL, server uses TodoItemRoute middleware
                                                        // to handle HTTP req sent to api/todo-items
app.listen(PORT, () =>                                  // add port, connect to server
    console.log(`Server running on port ${PORT}`));
