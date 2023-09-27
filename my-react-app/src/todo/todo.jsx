import './todo.css';
import {useState} from 'react';

function Todo (){
    let [bgTheme, setBgTheme] = useState('./icon-moon.svg')
    const [isLightTheme, setIsLightTheme] = useState(true);
    let [list, addList] = useState([]);
    const [completedList, setCompletedList] = useState([]);
    const [newItem, setNewItems] = useState('');
    const [isCheckActive, setCheckActive] = useState(false);
    const [filter, setFilter] = useState('all'); // Added filter state
    const [itemsRemaining, setItemsRemaining] = useState(0); // Initialize with 0
    /*
    we need to start using useState to access dom elements instead of vanilla js, chatGPT mentions our mistake here:
    Accessing DOM Elements: In React, it's generally not recommended to directly manipulate the DOM using vanilla JavaScript methods like 
    document.querySelector(). Instead, you should manage the state of your component and let React handle the rendering.

    Updating State: You should update the state based on the condition of the theme class, and the state change will trigger a re-render
    of the component with the new theme.
    */

    const toggleTheme = () => { //function for when we click the image icon
        setIsLightTheme(prevIsLightTheme => !prevIsLightTheme); //basically here, we're making useState change to false
        setBgTheme(isLightTheme ? './icon-sun.svg' : './icon-moon.svg'); //here, were saying if lighttheme is true, then lets use the moon image, else lets use the sun image
    };

    let todoValue;

   function addItemToArray(){
    if (newItem.trim() !== ''){//basically, if the value that is stored isnt an empty string/if someone actually typed something
        const updatedList = [...list, { text: newItem, pending: true, completed: false }]; // Add the 'completed' property
        addList(updatedList)
        setNewItems('') //we now want the value to be cleared so we can have them type something else to be stored. Also causes the input box to be cleared literally as value controls the input field
        updateItemsRemaining(updatedList) //updating the amount of items left when we add another to the list
    }
   }

   function toggleCompletion(index){
        const updatedList = [...list];
       updatedList[index].completed = !updatedList[index].completed; //basically, if we click the checkbox and the todo wasnt completed it will be now and vice versa is otherwise.
       addList(updatedList) //updating the actual list
       updateItemsRemaining(updatedList) //update the items remaining after one gets completed
   }
   

    // Function to update the count of pending items
    function updateItemsRemaining(updatedList) {
        const pendingItems = updatedList.filter((todo) => !todo.completed).length;
        setItemsRemaining(pendingItems);
    }

    // Function to filter todo items based on completion status
    function filterItems() {
        switch (filter) {
            case 'all':
                return list;
            case 'completed':
                return list.filter((todo) => todo.completed);
            case 'pending':
                return list.filter((todo) => !todo.completed);
            default:
                return list; //otherwise if we just load on we want it to be the whole list by default
        }
    }

    return(
        <section className={`todo-page ${isLightTheme ? 'light' : 'dark'}`}> 
        {/*basically we use string literals to allow us to have either the light class or dark class, depending on 
         if is lighttheme is true or false*/}
            <section className='heading-sec'>
            <div className='title'>
            <h1>todo</h1>
            <img 
            src={bgTheme}
            className='pointer theme-img'
            onClick={toggleTheme}
            />
            </div>

                <section className='list'>
                    <div className='textbox input'>
                        <svg
                            className='checkbox pointer'
                            xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <circle cx="12" cy="12" r="11.5" stroke="#393A4B" fill={isLightTheme ? 'white' : 'black'} />
                            <g opacity="0.01">
                                <circle cx="12" cy="12" r="12" fill="url(#paint0_linear_0_167)" />
                                <path d="M8 12.3041L10.6959 15L16.6959 9" stroke="white" />
                            </g>
                            <defs>
                                <linearGradient id="paint0_linear_0_167" x1="-12" y1="12" x2="12" y2="36" gradientUnits="userSpaceOnUse">
                                    <stop stop-color="#55DDFF" />
                                    <stop offset="1" stop-color="#C058F3" />
                                </linearGradient>
                            </defs>
                        </svg>
                        <input 
                        type="text"
                        placeholder="Create a new todo.."
                        className='pointer text'
                        value = {newItem} //we're storing the value that is typed in here
                        onChange={(e) => {//this monitors what is typed
                            setNewItems(todoValue = e.target.value)
                            console.log(todoValue)}
                                
                        }
                        onKeyDown={(event) => {{/*lets create another function that does all of this and creates the div when entre is clicked using usestate*/}
                        if (event.key == 'Enter'){
                            addItemToArray()
                        }
                            
                        {/*we then push the text into the array in the next div*/ }}}
                        />
                    </div>
                    <div className='todo-wrapper' >

                        {/*we use the && operator to g onto the next xentence if first is true*/}{/*giving each thing we map over a unique identifier by giving them different number keys, we prov a unique key prop using the index parameter.*/}
                            {/*we call filter items as it returns a list depending on what the filter is, after we get the respctive filter that we want, we can map through it and create todos based on that list, that will also allow us to get the remaining items that we're looking for*/}
                            {filterItems().map((todo, index) => ( 
                                <section>
                                <div className='todo textbox draggable' key={index} draggable='true'>
                                        {/* <svg xmlns="http://www.w3.org/2000/svg" width="11" height="8" viewBox="0 0 11 8" fill="none">
                                            <path d="M1 4.3041L3.6959 7L9.6959 1" stroke="white" />
                                        </svg> THIS IS THE TICK*/}
                                        <svg 
                                            className='checkbox pointer todo-checkbox'
                                            id={index}
                                            onClick={(ev) => {
                                                ev.target.classList.toggle('checkActive')
                                                if (ev.target.classList.contains('checkActive')) {
                                                    setCheckActive(true)
                                                } else {
                                                    setCheckActive(false)
                                                }
                                                toggleCompletion(index)
                                            }}
                                            xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                            <circle cx="12" cy="12" r="11.5" stroke="#393A4B" fill={isLightTheme ? 'white' : 'black'} />
                                            <g opacity="0.01">
                                                <circle cx="12" cy="12" r="12" fill="url(#paint0_linear_0_167)" />
                                                <path d="M8 12.3041L10.6959 15L16.6959 9" stroke="white" />
                                            </g>
                                            <defs>
                                                <linearGradient id="paint0_linear_0_167" x1="-12" y1="12" x2="12" y2="36" gradientUnits="userSpaceOnUse">
                                                    <stop stop-color="#55DDFF" />
                                                    <stop offset="1" stop-color="#C058F3" />
                                                </linearGradient>
                                            </defs>
                                        </svg>
                                    
                                        <div className='msg-and-delete'>
                                            <p id={index} className={`todoList ${isCheckActive ? 'cross' : ''}`}>{todo.text}</p>
                                            <img 
                                            id={index}
                                            src="./icon-cross.svg" 
                                            className="pointer" 
                                            onClick={(e) => {
                                                const index = e.target.id;
                                                let updatedList = [...list]
                                                updatedList.splice(index, 1)
                                                addList(updatedList)
                                                updateItemsRemaining(updatedList)
                                            }}
                                            />
                                        </div>
                                </div>
                                <div className='barrier'></div>
                                </section>
                            ))}

                        <section className='pages'>
                            <div className='remainingItems'>{itemsRemaining} items left</div>
                            <div
                                className={`pointer ${filter === 'all' ? 'active' : ''}`}
                                onClick={() => setFilter('all')}>
                                All
                            </div>
                            <div
                                className={`pointer ${filter === 'pending' ? 'active' : ''}`}
                                onClick={() => setFilter('pending')}>
                                Pending
                            </div>
                            <div
                                className={`pointer ${filter === 'completed' ? 'active' : ''}`}
                                onClick={() => setFilter('completed')}>
                                Completed
                            </div>
                            <div 
                            className='pointer'
                            onClick={() => {
                                list.map((item) => {
                                    if (item.completed){
                                        // if we click clear completed we want to remove everything in the array that has completed to be true
                                    }
                                })
                            }}
                            >Clear Completed</div>
                        </section>
            
                        {/*create an empty array for react loops, then everytime we click w on the input, we will have it input those thing into the array*/}
                    </div>
                </section>
            </section>
        </section>
    )


}

export default Todo;