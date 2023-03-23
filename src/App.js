

import Header from './Header';
import SearchItem from './SearchItem';
import Content from './Content';
import Footer from './Footer';
import { useState } from 'react';
import AddItem from './AddItem';
import { useEffect,useRef } from 'react';
import apiRequest from './apiRequest';

function App() {
  
  const API_URL = `http://localhost:3500/items`;

  // const [items, setItems] = useState(JSON.parse(localStorage.getItem('To-doList')) || []);
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState('');
  const [search, setSearch] = useState('');
  const [fetchError, setFetchError] = useState(null);
  const [dataIsLoading, setDataIsLoading] = useState(true)
  // for loading items from default state
  // const [items, setItems] = useState([
  //   {
  //     id: 1,
  //     checked: true,
  //     item: "item1"
  //   },
  //   {
  //     id: 2,
  //     checked: false,
  //     item: "item2"
  //   },
  //   {
  //     id: 3,
  //     checked: true,
  //     item: "item3"
  //   }
  // ]);
  useEffect(() =>{
    const fetchItems = async () => {
      try {
        const response = await fetch(API_URL);
        if(!response.ok) throw Error('Did not receive Expected Data')
        const listItems = await response.json();
        // console.log(listItems);
        setItems(listItems);
        
        setFetchError(null);
        

      } catch (error) {
        // console.log(error.stack);
        // console.log(error.message);
        setFetchError(error.message)
      }
      finally {
        setDataIsLoading(false)
      }
      
    }
      setTimeout(() =>{
        // (async () => await fetchItems())();
          fetchItems()
      }, 2000)
  },[])
  // useEffect(() =>{
  //   localStorage.setItem('To-doList', JSON.stringify(items));
  // },[items])
 

  // const setAndSaveItems = (newItems) => {
  //   setItems(newItems);
  //   localStorage.setItem('To-doList', JSON.stringify(newItems));
  // }// done this function with use effect

  const addItem = async (item) => {
    
    const id = items.length ? items[items.length -1].id + 1 : 1;
    /*
    const id = items.length ? items[items.length -1].id + 1 : 1; this line
    goes very well with the api nature because once assigned the local rest API will not re assign the 
    same position to another data on a total session of it online and offline. It will store 
    that a data was there but it is not now so it keep the position empty. this is very helpful 
    for deleting data by order which the user entered. so for an instance if the user enters
    the data of order 4 the api will delete the data but it will not reassign the position
    to another data. so after that if the user suppose enters data  after deleting the order of them
    will not be changes as the 4th value will be empty. const id = items.length ? items[items.length -1].id + 1 : 1
    using this syntax we can get the exact order of the data the user entered and
    use it to delete the data on that particular order as the api keeps the slot of the 
    deleted data empty.If the user wants to delete the data which he entered in the 6th order
    we can easily delete it because  const id = items.length ? items[items.length -1].id + 1 : 1
    with this syntax we are setting the id of the item to cope with the API order and slot nature.
    
    But there is a catch:----- If the user deletes every data he entered means he
    empties th data stored in the API then the API will not have any data to store
    then to optimize the space the API will refresh once again and start setting all the
    upcoming data from the first order. So, anything the user enters any Data after deleting all data the
    API data stored in it it will we pushed to the first slot and again this syntax --
    const id = items.length ? items[items.length -1].id + 1 : 1 matches with it perfectly
    So don't panic. Just think simply not to calculate id data based on length if you want to 
    delete it dynamically. Rather You should use the id length to go into previous data and see 
    what was the id value and increment it based on the value of the previous data. This practice
    should be followed

    */
    const myNewItem = { id, checked: false,item };
    const listItems = [...items, myNewItem];
    setItems(listItems);
console.log(listItems);
    const postOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(myNewItem)
    }
    const result = await apiRequest(API_URL, postOptions)
    if(result) setFetchError(result);
  }
  
  const handleCheck = async (id) =>{
    const listItems = items.map((item) => item.id === id ? { ...item,
       checked: !item.checked } : item);
       setItems(listItems);

       const myItem = listItems.filter(item => item.id === id);
      const updateOptions = {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({checked: myItem[0].checked})
      };
      const reqUrl  = `${API_URL}/${id}`;
      const result = await apiRequest(reqUrl, updateOptions);
      if(result) setFetchError(result);
       }
  
  const handleDelete = async (id) => {
    // console.log(id);
    const listItems = items.filter((item) => item.id !== id);
    setItems(listItems);
    
    const deleteOptions = {
      method: 'DELETE'
    }
    
    const reqUrl  = `${API_URL}/${id}`;
    const result = await apiRequest(reqUrl, deleteOptions);
      if(result) setFetchError(result);
  } 
  const handleSubmit = (event) => {
    event.preventDefault();
    if(!newItem) return;
    // console.log(newItem);
    //addItem
    addItem(newItem);
    setNewItem('');
    // console.log(newItem);

  }
 

  return (
    <div className="App">
      
      <Header title="To-Do List" />
      
      <AddItem
        newItem={newItem}
        setNewItem={setNewItem}
        handleSubmit={handleSubmit}
      />
      <SearchItem 
      search={search}
      setSearch={setSearch}
      />
      <main>
        { dataIsLoading && <p>Loading Items ....</p>}
        {fetchError && <p style={{ color: "red"}}>{`Error: ${fetchError}`}</p>}
       { !fetchError && !dataIsLoading && <Content
        items={items.filter(item =>((item.item).toLowerCase()).includes(search.toLowerCase()))}
        handleCheck={handleCheck}
        handleDelete={handleDelete}
        /> 
        }
      </main>
      <Footer length={items.length} />
    </div>
  );
}


export default App;
