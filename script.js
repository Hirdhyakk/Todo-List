"use strict";

let todos = [];
let todosUncheck = [];
let todosCheck = [];
let index;
const container = document.getElementById('todo_list');
// let currentEditId = null;

// Function to get todos from Local Storage
function getTodosFromLocalStorage() {
    let todosString = localStorage.getItem('todos');

    // if localStorage doesn't have todos
    if (!todosString) return [];

    // Convert todos of localStorage to array of objects
    todos = JSON.parse(todosString) || [];
}
getTodosFromLocalStorage();

// Function to print all todos
function printTodo() {
    todos.forEach(todo => {
        if (!todo.isDeleted) {
            // printSingleTodo(todo);
            // console.log(todo);
            if (todo.checked) todosCheck.push(todo);
            else if (!todo.checked) todosUncheck.push(todo);
        }
    });
    todosUncheck.forEach(todo => {
        if (!todo.isDeleted) {
            printSingleTodo(todo);
            // console.log(todo);
            // if (todo.checked) todosCheck.push(todo);
            // else if (!todo.checked) todosUncheck.push(todo);
        }
    });
    todosCheck.forEach(todo => {
        if (!todo.isDeleted) {
            printSingleTodo(todo);
            // console.log(todo);
            // if (todo.checked) todosCheck.push(todo);
            // else if (!todo.checked) todosUncheck.push(todo);
        }
    });
}
// function to print single todo
function printSingleTodo(todo) {
    let todoDiv = getTodoContainer(todo);
    addTodoToContainer(todoDiv);
    index = todo.id;
}

// Function to add todo div to dom container 
function addTodoToContainer(todoDiv) {
    container.appendChild(todoDiv);
}

// Funtion to create todo div/container
function getTodoContainer(todo) {
    // Outer div of todo contanier
    const outerDiv = document.createElement('div');
    outerDiv.classList.add('todo_div');
    outerDiv.setAttribute('id', `todo-${todo.id}`); // Set unique id to the div

    // input field to show name of todo
    const ele = document.createElement('input');
    ele.classList.add('todo_ele');
    ele.setAttribute('readonly', 'true');
    ele.value = todo.name;
    if (todo.checked) ele.classList.add("done_todo");

    // button to edit values of todo
    const btnEdit = document.createElement('button');
    btnEdit.classList.add('btn');
    btnEdit.classList.add('btn-outline-primary');
    btnEdit.textContent = 'Edit';
    btnEdit.addEventListener('click', () => editTodo(ele, btnEdit, todo));

    // button to delete todo
    const btnDelete = document.createElement('button');
    btnDelete.classList.add('btn');
    btnDelete.classList.add('btn-outline-primary');
    btnDelete.textContent = 'Delete';
    btnDelete.addEventListener('click', () => deleteTodo(outerDiv, todo.id));

    // button to check or uncheck todo
    const btnCheck = document.createElement('button');
    btnCheck.classList.add('btn');
    btnCheck.classList.add('btn-outline-primary');
    btnCheck.textContent = 'Check';
    // if todo is checked
    if (todo.checked) {
        btnCheck.classList.add('btn-primary');
        btnCheck.classList.add('text-white');
        btnCheck.textContent = 'Uncheck';
    }
    btnCheck.addEventListener('click', () => checkTodo(todo, btnCheck, ele, btnEdit));

    // add all elements to the todo outer div
    outerDiv.appendChild(ele);
    outerDiv.appendChild(btnEdit);
    outerDiv.appendChild(btnDelete);
    outerDiv.appendChild(btnCheck);

    return outerDiv;
}

// function to update LocalStorage
function updateLocalStorage() {
    localStorage.setItem('todos', JSON.stringify(todos));
}

// function to add todo to localStorage and 
function addTodo(todo) {
    todos.unshift(todo);
    updateLocalStorage();
}
// function to create todo obj and add to local array and dom
function createTodoObj(name) {
    let index = 0;
    if (todos.length > 0) index = todos[0].id;
    addTodo({ id: index + 1, name: name, checked: false, isDeleted: false });
    let todoDiv = getTodoContainer({ id: index + 1, name: name, checked: false });
    container.insertBefore(todoDiv, container.firstChild);
    // printSingleTodo({ id: index + 1, name: name, checked: false });
}
// function to add new todo
function addItem() {
    let addItem = document.getElementById('addItem');
    addItem.addEventListener("keydown", (event) => {
        let value = event.target.value.trim();
        if (event.key === "Enter" && value) {
            createTodoObj(value);
            event.target.value = '';
        }
    })
}
addItem()

// function to delete todo from dom
function removeTodoFromContainer(todoDiv) {
    container.removeChild(todoDiv);
}
// function to delete todo from local array, dom and localStorage
function deleteTodo(todoDiv, id) {
    // todos = todos.filter(todo => todo.id !== id);
    todos.forEach(todo => {
        if (todo.id === id) { todo.isDeleted = true; }
    });
    removeTodoFromContainer(todoDiv);
    updateLocalStorage();
}

// function to edit name of todo
function editTodo(ele, btnEdit, todoEdit) {
    // if ((currentEditId === null || currentEditId === todoEdit.id) && !todoEdit.checked) {
    // console.log(todoEdit);
    if (ele.hasAttribute('readonly') && !todoEdit.checked) {
        // console.log(todoEdit.checked);
        ele.removeAttribute('readonly');
        ele.focus();
        btnEdit.classList.add('btn-primary');
        btnEdit.classList.add('text-white');
        // btnEdit.textContent = 'Cancel';
        // currentEditId = todoEdit.id;
        ele.addEventListener("keydown", (event) => {
            let value = event.target.value.trim();
            if (event.key === "Enter" && value) {
                ele.value = value;
                todos.forEach(todo => {
                    if (todo.id === todoEdit.id) {
                        todo.name = value;
                    }
                });
                updateLocalStorage();
                ele.setAttribute('readonly', 'true');
                ele.blur();
                btnEdit.classList.remove('btn-primary');
                btnEdit.classList.remove('text-white');
                btnEdit.textContent = 'Edit';
                // currentEditId = null;
            }
        })

        ele.addEventListener("focusout", (event) => {
            // console.log('focus lost');
            ele.setAttribute('readonly', 'true');
            todos.forEach(todo => {
                if (todo.id === todoEdit.id) {
                    ele.value = todo.name;
                }
            });
            updateLocalStorage();
            btnEdit.classList.remove('btn-primary');
            btnEdit.classList.remove('text-white');
            btnEdit.textContent = 'Edit';
            // currentEditId = null;
        });
    } else {
        ele.setAttribute('readonly', 'true');
        todos.forEach(todo => {
            if (todo.id === todoEdit.id) {
                ele.value = todo.name;
            }
        });
        updateLocalStorage();
        btnEdit.classList.remove('btn-primary');
        btnEdit.classList.remove('text-white');
        btnEdit.textContent = 'Edit';
        // currentEditId = null;
    }
    // }
}

// function to check or uncheck todo
function checkTodo(todoCheck, btnCheck, ele, btnEdit) {
    if (!ele.hasAttribute('readonly')) {
        editTodo(ele, btnEdit, todoCheck);
    }
    todos.forEach(todo => {
        if (todo.id === todoCheck.id) {
            todo.checked = !todo.checked;
            todoCheck.checked = todo.checked;

            const todoDiv = document.getElementById(`todo-${todo.id}`); // Get the todo div by its ID

            if (todo.checked) {
                // Remove from unchecked and add to checked
                todosUncheck = todosUncheck.filter(uncheckTodo => uncheckTodo.id !== todo.id);
                todosCheck.push(todo);

                // todos.push(todos.splice(index, 1)[0]);
                btnCheck.classList.add('btn-primary');
                btnCheck.classList.add('text-white');
                btnCheck.textContent = 'Uncheck';
                ele.classList.add("done_todo");

                // Move the todo element in the DOM
                // const todoDiv = ele.parentElement; // Get the outer div
                container.appendChild(todoDiv); // Move it to the bottom
            } else {
                // Remove from checked and add to unchecked
                todosCheck = todosCheck.filter(checkTodo => checkTodo.id !== todo.id);
                todosUncheck.push(todo);

                btnCheck.classList.remove('btn-primary');
                btnCheck.classList.remove('text-white');
                btnCheck.textContent = 'Check';
                ele.classList.remove("done_todo");

                // Move the todo element to the top of the container
                container.insertBefore(todoDiv, container.firstChild);
            }
        }
    });
    updateLocalStorage();
}

printTodo();


/*

1. Order -- 
2. isDeleted -- DONE

*/