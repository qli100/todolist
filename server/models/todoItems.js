// import mongoose to create mongoose model
const mongoose = require('mongoose');

// create Schema
const TodoItemSchema = new mongoose.Schema(
{
  item: 
  {
    type: String,
    required: true
  },
  subitems: 
  [{
    text: 
    {
      type: String,
      required: false
    }
  }]
});

// export this Schema
module.exports = mongoose.model('todo', TodoItemSchema);