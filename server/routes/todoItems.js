const router = require('express').Router();             // import Router from Express lib and create new inst to define API routes
const todoItemsModel = require('../models/todoItems');  // import TodoItem model to interact w mongoDB

router.post('/api/item', async (req, res) =>            // route to handle HTTP POST req
{
    try
    {                                                   // create TodoItem obj, item from req.body that has data from POST req submission
      const newItem = new todoItemsModel({
        item: req.body.item,
        subitems: req.body.subitems || []               // subitems not provided
      });
      const saveItem = await newItem.save();            // save item in database
      res.status(200).json(saveItem);                   // send JSON resp
    } 
    catch (err) 
    {
      res.json(err);
    }
});

// router.post('/api/item', async (req, res) =>            // route to handle HTTP POST req
// {
//     try                                                 
//     {                                                   // create TodoItem obj, item from req.body that has data from POST req submission
//         const newItem = new todoItemsModel({ item: req.body.item });
//         const saveItem = await newItem.save();          // save item in database
//         res.status(200).json(saveItem);                 // send JSON resp
//     }
//     catch (err)
//     {
//         res.json(err);
//     }
// });

router.get('/api/items', async (req, res) =>            // route to handle HTTP GET req
{
    try
    {                                                   // retrieve all TodoItem obj from db
        const allTodoItems = await todoItemsModel.find({});
        res.status(200).json(allTodoItems);             // send JSON resp & array of all TodoItem obj
    }
    catch (err)
    {
        res.json(err);
    }
});

router.put('/api/item/:id', async (req, res) =>         // route for HTTP PUT req to update item
{
    try
    {                                                  // find item by id & update w req.body
        const updateItem = await todoItemsModel.findByIdAndUpdate(req.params.id, {$set: req.body});
        res.status(200).json(updateItem);
    }
    catch (err)
    {
        res.json(err);
    }
}); 

router.delete('/api/item/:id', async (req, res) =>      // route for HTTP DELETE
{
    try                                                 
    {                                                   // find item by id & delete it
        const deleteItem = await todoItemsModel.findByIdAndDelete(req.params.id);
        res.status(200).json('Item Deleted');
    }
    catch (err)
    {
        res.json(err);
    }
});

module.exports = router;                                // export routes

