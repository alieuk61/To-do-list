import './todo.css';
import './mobile-todo.css';
import {useState, useRef, useEffect} from 'react';

function Todo (){
    let [bgTheme, setBgTheme] = useState('./icon-moon.svg')
    const [isLightTheme, setIsLightTheme] = useState(true);
    const [list, addList] = useState([]);
    const [newItem, setNewItems] = useState('');
    const [filter, setFilter] = useState('all'); // Added filter state
    const [itemsRemaining, setItemsRemaining] = useState(0); // Initialize with 0
    const itemDragging = useRef(null); // Initialize with null //the element that is being dragged, initializing with null
    const dropInContainer = useRef(); //here we're pretty much doing the same thing s document.queryselector (getting an element)
    // Add state to keep track of the target todo item index
    const [targetIndex, setTargetIndex] = useState(null);
    const [draggedIndex, setDraggedIndex] = useState(null);
    const todoListRefs = useRef([]);
    const page = useRef();
    const [className, setClassName] = useState('');
    //1, click a button, access and store the current todoL with an index relative to the button clicked, toggle a classlist to them
    /*
    we need to start using useState to access dom elements instead of vanilla js, chatGPT mentions our mistake here:
    Accessing DOM Elements: In React, it's generally not recommended to directly manipulate the DOM using vanilla JavaScript methods like 
    document.querySelector(). Instead, you should manage the state of your component and let React handle the rendering.

    Updating State: You should update the state based on the condition of the theme class, and the state change will trigger a re-render
    of the component with the new theme.
    */

    let todoValue;

    const toggleTheme = () => { //function for when we click the image icon
        setIsLightTheme(prevIsLightTheme => !prevIsLightTheme); //basically here, we're making useState change to false
        setBgTheme(isLightTheme ? './icon-sun.svg' : './icon-moon.svg'); //here, were saying if lighttheme is true, then lets use the moon image, else lets use the sun image
    };

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

    function handleCheckboxClick(index) {
        const todoElement = todoListRefs.current[index];
            // You can access and manipulate the todoElement here
            // For example, toggle a class
        if (isLightTheme){
            todoElement.classList.toggle('light-cross')
        }else{
            todoElement.classList.toggle('dark-cross')
        }
        // Add any other logic you want to perform on the todoElement
        // based on the checkbox click.
    }

    useEffect(() => {
        // Define a function to calculate the class name based on window.innerWidth and isLightTheme
        const getClassName = () => {
            if (window.innerWidth <= 375 && isLightTheme) {
                return 'mobile-light';
            } else if (window.innerWidth <= 375 && !isLightTheme) {
                return 'mobile-dark';
            } else if (window.innerWidth > 375 && isLightTheme) {
                return 'light';
            } else {
                return 'dark';
            }
        };

        // Set the initial class name
        setClassName(getClassName());

        // Listen to window resize events and update the class name when needed
        const handleResize = () => {
            setClassName(getClassName());
        };

        window.addEventListener('resize', handleResize);
        // Clean up the event listener when the component unmounts
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [isLightTheme]);


    return(
        <section 
        className={`todo-page ${className}`}
        ref={page}
        >  
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
                    <div className={`textbox input ${isLightTheme ? 'white-todo' : 'black-todo'} `}>
                        <svg
                            className='checkbox pointer'
                            xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <circle cx="12" cy="12" r="11.5" stroke="#393A4B" fill={isLightTheme ? 'white' : 'black-todo'} />
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
                            className={`pointer text ${isLightTheme ? 'white-todo' : 'black-todo'} `}
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

                    {/* LIST WRAPPER */}
                    <div 
                        className={`todo-wrapper ${isLightTheme ? 'white-todo' : 'black-todo'} `} 
                    onDragOver={(e) => {
                        e.preventDefault();
                        const index = parseInt(e.target.getAttribute('data-index'), 10); //getting the index of the thing we're dragging, the 10 means its a decimal number or base 10
                        setDraggedIndex(index);
                        // Get the position of the mouse relative to the container
                        const mouseY = e.clientY - dropInContainer.current.getBoundingClientRect().top;
                        // Calculate the index of the target todo item
                        const newIndex = Math.floor(mouseY / 60); // Assuming each todo item is 60px in height

                        // Update the targetIndex state
                        setTargetIndex(newIndex);
                    }}
                    ref={dropInContainer}
                    >
                        {/*
                        dragstart: Fired when the user starts dragging an element.
                        drag: Fired continuously as the element is dragged. (during the dragging)
                        dragover: Fired continuously as a draggable element is over a valid drop target. (we can use this when dragging over elements)
                        drop: Fired when the user drops a draggable element onto a drop target. (this is  for when we drop it above or below a div)
                        dragend: Fired when the drag operation is completed (e.g., when the user releases the mouse button). (end)                        
                         */}

                        {/*we use the && operator to g onto the next xentence if first is true*/}{/*giving each thing we map over a unique identifier by giving them different number keys, we prov a unique key prop using the index parameter.*/}
                            {/*we call filter items as it returns a list depending on what the filter is, after we get the respctive filter that we want, we can map through it and create todos based on that list, that will also allow us to get the remaining items that we're looking for*/}
                            
                            {/* THE ACTUAL LIST */}
                            {filterItems().map((todo, index) => ( 
                                <section 
                                    className={`move-cursor `}
                                    key={index}
                                    id='draggableElement'
                                    draggable='true'
                                    onDragStart={(e) => {
                                        itemDragging.current = e.target //changing the itemdragging var to doc.querySelector(the todo thats being clicked)
                                        itemDragging.current.classList.add('dragging')

                                        
                                    }}
                                    onDragEnd={(e) => {
                                        if (targetIndex !== null && draggedIndex !== null) {
                                            const updatedList = [...list];
                                            const draggedItem = updatedList.splice(draggedIndex, 1)[0]; // Remove the dragged item, since splice returns another array of the item that was removed, the array returned only had one element (the removed item), so the index at the end is that item

                                            // Insert the dragged item above or below the target item
                                            if (targetIndex >= draggedIndex) {
                                                updatedList.splice(targetIndex, 0, draggedItem);//if the index of the item we're dragging is smaller than the index where we want it to be, put it below
                                            } else {
                                                updatedList.splice(targetIndex + 1, 0, draggedItem); //if the index of the item we're dragging is bigger than the index where we want it to be, then put it above the targetedIndex
                                            }

                                            // Update the list and reset the targetIndex and draggedIndex
                                            addList(updatedList);
                                            setTargetIndex(null);
                                            setDraggedIndex(null);

                                            // Remove the dragging class
                                            itemDragging.current.classList.remove('dragging');
                                        }
                                    }}
                                
                                // when dragging we need to see what we're hovering over/closest thing we're next to
                                // we also need to see if we're above that thing or below it using .clientY
                                >
                                <div 
                                className={`todo textbox ${isLightTheme ? 'white-todo' : 'black-todo'} `}
                                key={index}
                                
                                >
                                        {/* <svg xmlns="http://www.w3.org/2000/svg" width="11" height="8" viewBox="0 0 11 8" fill="none">
                                            <path d="M1 4.3041L3.6959 7L9.6959 1" stroke="white" />
                                        </svg> THIS IS THE TICK*/}
                                        <svg 
                                            className='checkbox pointer todo-checkbox'
                                            id={index}
                                            onClick={(ev) => {
                                            handleCheckboxClick(index)
                                            toggleCompletion(index)
                                            }}
                                            xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                            <circle cx="12" cy="12" r="11.5" stroke="#393A4B" fill={isLightTheme ? 'white' : 'black-todo'} />
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
                                    
                                        <div className='msg-and-delete' ref={(element) => (todoListRefs.current[index] = element)} >
                                            <p id={index} className={`todoList`}>{todo.text}</p>
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
                                <div className={` ${isLightTheme ? 'barrier' : 'dark-barrier'} `}></div>
                                </section>
                            ))}

                        <section className={`pages ${isLightTheme ? 'white-todo' : 'black-todo'} `}>
                            <div className='remainingItems'>{itemsRemaining} items left</div>
                            <div
                                className={`pointer page ${filter === 'all' ? 'active' : ''}`}
                                onClick={() => setFilter('all')}>
                                All
                            </div>
                            <div
                                className={`pointer page ${filter === 'pending' ? 'active' : ''}`}
                                onClick={() => setFilter('pending')}>
                                Pending
                            </div>
                            <div
                                className={`pointer page ${filter === 'completed' ? 'active' : ''}`}
                                onClick={() => setFilter('completed')}>
                                Completed
                            </div>
                            <div 
                            className='pointer'
                            onClick={() => {
                                let oldList = [...list];
                                let updatedList = [];
                                oldList.map(items => {
                                    if (!items.completed){
                                        updatedList.push(items)
                                    }
                                })

                                addList(updatedList);

                            }}
                            >Clear Completed</div>
                        </section>
                    </div>
                    <div className={` ${isLightTheme ? 'grid' : 'dark-grid'} `}>Drag and drop to reorder list</div>
                </section>
            </section>
        </section>
    )


}

export default Todo;