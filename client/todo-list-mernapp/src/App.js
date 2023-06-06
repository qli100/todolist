import './App.css';                                 
import axios from 'axios';                          // axios lib for HTTP req
import {useState, useEffect} from 'react';

function App() 
{
  const [itemText, setItemText] = useState('');
  const [listItems, setListItems] = useState([]);   // array of Todo items
  const [isUpdating, setIsUpdating] = useState(''); // id of updating item
  const [updateItemText, setUpdateItemText] = useState('');
  const [isAddingSubitem, setIsAddingSubitem] = useState('');
  const [subitemText, setSubitemText] = useState('');


  useEffect(() =>                                   // fetch all items from db
  {
    const getItemsList = async () => 
    {
      try
      {                                             // get resp
        const res = await axios.get('http://localhost:5500/api/items')
        setListItems(res.data);                     // update w resp/res
        console.log('render');                      // for debugging*
      }
      catch(err)
        { console.log(err); }
    }
    getItemsList();                                 // trigger GET to server
  },[]);                                            // dont rerun when rerendered*
  // *2nd arg is [] so only run effect once, bc no dependencies in array, cant rerun

 
  const addItem = async (e) => 
  {
    e.preventDefault();                             // prevent page reload
    if (!itemText.trim())                           // dont allow empty input
      { return; }

    try
    {                                               // res stores item obj from POST req      
      const newItem = { item: itemText, subitems: [] };
      const res = await axios.post('http://localhost:5500/api/item', newItem);
      setListItems(prev => [...prev, res.data]);    // add new item to end by
      setItemText('');                              // new array using spread to inclu
    }                                               // all items from prev array & add
    catch(err)                                      // res.data to end
      { console.log(err); }
  }

  
  const addSubitem = async (id, subitem) => 
  {
    if (!subitem.trim())                            // dont allow empty input
    {
      setIsAddingSubitem('');                       // hide input form
      return; 
    }

    try 
    {                                               // new array by map/loop over old
      const updatedItems = listItems.map((item) => 
        {                                           // return same except subitems 
          if (item._id === id)                      // which replaced by new array
          {                                         // subitem param is new obj
            return { ...item,                       // spread creates copy of og item
            subitems: [...item.subitems, { text: subitem }], };
          }                                         // overwrite subitems with new array
          else                                      // created w spread w og item.subitems
            { return item; }                        // & new subitem at end
        });                                         // w/o modidying og item*
        const res = await axios.put(`http://localhost:5500/api/item/${id}`, 
        {subitems: updatedItems.find((item) => item._id === id).subitems});
        console.log(res.data); 
        setListItems(updatedItems);                 // update w new array
        setIsAddingSubitem('');                     // hides subitem form
        setSubitemText('');                         // clear input
      } 
      catch(err)
        { console.log(err); }
  }
  /* I created new array updatedItems bc if didnt, was directly modifying existing
  subitems array in listItems object using spread to add new subitem. But React state
  should be immutable. Without updatedItems, I was getting every other subitem,
  not all of them. It's probably bc when directly modifying array, React may not have
  detected array change, not rerender. */
  

  const renderAddSubitemForm = (id) => 
  {
    try 
    {                                              // isAddingSubitem = parent item id
      return isAddingSubitem === id ? (             
        <form className="subitem-form" onSubmit={(e) => 
        {
          e.preventDefault();
          addSubitem(id, subitemText);
        }}>
          <input className = "subitem-input" type = "text"
          onChange = {(e) => setSubitemText(e.target.value)}
          value = {subitemText} />
        </form>
      ) : null;                                     // ret null if bad id
    } 
    catch(err)
      { console.log(err); }
  }


  const updateItem = async (e) =>                   // update item
  {
    e.preventDefault()
    try
    {
      if (!updateItemText.trim())                   // dont allow empty input
      { 
        setIsUpdating('');                          // hide form
        return;
      }                                             // else update
      const res = await axios.put(`http://localhost:5500/api/item/${isUpdating}`, {item: updateItemText})
      console.log(res.data)
      const updatedItemIndex = listItems.findIndex(item => item._id === isUpdating);
      const updatedItem = listItems[updatedItemIndex].item = updateItemText;
      setUpdateItemText('');
      setIsUpdating('');
    }
    catch(err)
      { console.log(err); }
  }


  const renderUpdateForm = () =>                    // before updating, show input field 
  (                                                 // where will create updated item
    <form className="update-form" onSubmit = {(e) => {updateItem(e)}} >
        <input className="update-input" type="text" 
        onChange = {e => setUpdateItemText(e.target.value)} 
        value = {updateItemText} />
    </form>
  )
  // this func ret a JSX (JS XML) ele that reps a form w class name "update-form"
  
  
  const deleteItem = async (id) =>                  
  {
    try
    {                                               // filter method rets array wo id
      const res = await axios.delete(`http://localhost:5500/api/item/${id}`);
      setListItems(prevItems => prevItems.filter(item => item._id !== id));
    }
    catch(err)
      { console.log(err); }
  }
  

  return(
    <div className = "App">                         
      <h1> TODO </h1>
      <form className = "form" onSubmit = {e => addItem(e)}>
        <input type = "text" placeholder = '' onChange = {e => {setItemText(e.target.value)}} value = {itemText} />        
        <button type = "submit"> + </button>
      </form>

      <div className = "todo-listItems">
      {
        listItems.map(item =>
        (
          <div className = "todo-item" key = {item._id}>
          {
            isUpdating === item._id
            ? renderUpdateForm()                    // if updating call func, else show button
            : <>  

            <input type="checkbox"></input>    
            <div className="item-content">          
              <p onClick={() => setIsUpdating(item._id)}> {item.item} </p>
              {isAddingSubitem === item._id && renderAddSubitemForm(item._id)}

              {item.subitems.map(subitem => (
                <div className="subitem-content" key = {subitem._id} >   
                  <input type="checkbox"/>
                  <p className="subitem-content"> {subitem.text} </p>
                </div>
              ))}
            </div>

            <button className="add-subitem" onClick= {() => setIsAddingSubitem(item._id)}> + </button>
            <button className = "delete-item" onClick = {() => deleteItem(item._id)}> X </button>
            </>
          }
          </div>
        ))
      }    
      </div>
    </div>
  );
}


export default App;
