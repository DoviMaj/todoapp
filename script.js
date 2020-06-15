//takes care of the todo list actions and data
let todosList = {
    todos: [{
        todoText: "Item 1",
        completed: false
    },
    {
        todoText: 'Item 2',
        completed: false
    },
    {
        todoText: 'Item 3',
        completed: false
    }],
    addTodo: function(todoText){
        this.todos.push({
            todoText: todoText,
            completed: false
        });
        view.displayTodos();
    },

    changeTodo: function(position, todoText){
        this.todos[position].todoText = todoText;
        view.displayTodos();
    },

    deleteTodo: function(position){
        this.todos.splice(position, 1);
        view.displayTodos();
    }, 

    deleteAll: function(){ 
        let todos = JSON.stringify(todosList.todos);
        localStorage.setItem("todos", todos);

        for (var i= todosList.todos.length; i>=0; i--) {
           todosList.deleteTodo(i);
        }
       this.restoreTodos();
    },

    restoreTodos: function() {
        let localData = JSON.parse(localStorage.getItem("todos"));
        let topButtons = document.getElementById("topButtons");
        let restoreButton = document.createElement("span");
        restoreButton.addEventListener("click", function(){
            todosList.todos = localData;
            this.remove();
            view.displayTodos();
        })
        restoreButton.innerText = "undo"
        topButtons.appendChild(restoreButton);

        setTimeout(function(){ restoreButton.remove() ; }, 3000);
        
        view.displayTodos();
    },

    

    toggleCompleted: function(position){
        this.todos[position].completed = !this.todos[position].completed;
        view.displayTodos();
    },

    toggleAll: function(){
        let completedTodos = 0;
        let totalTodos = this.todos.length;

        this.todos.forEach(function(todos){
            if(todos.completed === true){
                completedTodos++;
            }
        })

        this.todos.forEach(function(todos){
        if(completedTodos === totalTodos){
            todos.completed = false;
        } else {
            todos.completed = true;
            }
        })
        view.displayTodos();
    }
}

let addTodoTextInput = document.getElementById("addTodoTextInput");

addTodoTextInput.addEventListener("keyup", function(event){
    if (event.keyCode === 13) {
        handlers.addTodo(addTodoTextInput.value);
    }
});
 
//takes care of the user interactions
let handlers = {
    addTodo: function() {
        let addTodoTextInput = document.getElementById("addTodoTextInput");
        if(addTodoTextInput.value === ""){
            console.log("you havent enterend a value");
        } else {
            todosList.addTodo(addTodoTextInput.value);
        }
        addTodoTextInput.value = "";
    }, 
    changeTodo: function() { 
        let changeTodoPositionInput = document.getElementById("changeTodoPositionInput");
        let changeTodoTextInput = document.getElementById("changeTodoTextInput"); 
        if(changeTodoTextInput.value === "" || changeTodoPositionInput.value === ""){
            console.log("you havent enterend the values for change");
        } else {
            todosList.changeTodo(changeTodoPositionInput.valueAsNumber, changeTodoTextInput.value)
        }
        changeTodoPositionInput.value = "";
        changeTodoTextInput.value = "";
    },
    deleteTodo: function(position) {
        todosList.deleteTodo(position, 1);
    },
    toggleCompleted: function() {
        let toggleCompletedPositionInput = document.getElementById("toggleCompletedPositionInput");
        todosList.toggleCompleted(toggleCompletedPositionInput);
    }
};

//takes care of displaying the todo list
let view = {
    displayTodos: function(){
    todosUl = document.querySelector("ul");
    todosUl.innerHTML = "";
    todosList.todos.forEach(function(todo, position){
        let todosLi = document.createElement("li");
        todosLi.textContent =  todo.todoText;
        todosLi.id = position; 
        todosLi.addEventListener("mouseover", function(event){
            if(event.target.childNodes.length === 3){
            event.target.childNodes[2].classList.remove("hide");
            } 
        }) ,
        todosLi.addEventListener("mouseleave", function(event){
            event.target.childNodes[2].classList.add("hide");  
        })

        let checkBox = document.createElement("input");
        checkBox.type = "checkbox"; 
        checkBox.className = "checkBox"; 
        checkBox.id = position;
        checkBox.checked = todo.completed;

        if(checkBox.checked){
            todosLi.classList.add("checked", "todosLi");
        } else {
          todosLi.classList.add("todosLi") ;
        };

        let changeTodoInput = document.createElement("input");
        changeTodoInput.type = "text";
        changeTodoInput.id = position;
        changeTodoInput.classList.add("hide", "changeTodoInput")
        changeTodoInput.addEventListener("keyup", function(event){
            if (event.keyCode === 13){
                if(changeTodoInput.value !== ""){
                    todosList.changeTodo(changeTodoInput.id, changeTodoInput.value);
                } else {
                    view.displayTodos();
                }
            }
        });

        changeTodoInput.addEventListener("blur", function(event){
            view.displayTodos();
        })

           
        todosUl.className = "todosUl" ;

        todosUl.appendChild(todosLi);
        todosUl.appendChild(changeTodoInput);
        todosLi.appendChild(checkBox);
        todosLi.appendChild(this.deleteButton());
    }, this)
    },
    deleteButton: function(){
        let deleteButton = document.createElement("button");
        deleteButton.classList.add("deleteButton", "hide") ;
        deleteButton.innerText = "x";
        return deleteButton;
    },
    setUpEventListeners: function(){
        var todosUl = document.querySelector("ul");
        todosUl.addEventListener("click", function(event) {
        let clickedElement = event.target;
        if(clickedElement.className === "deleteButton"){
          handlers.deleteTodo(clickedElement.parentNode.id, 1);
          }
          if(clickedElement.className === "checkBox"){
            todosList.toggleCompleted(clickedElement.id);
          }
          if(clickedElement.className === "todosLi"){
            clickedElement.classList.add("hide") ;
            clickedElement.nextSibling.classList.remove("hide");
            clickedElement.nextSibling.focus();
            clickedElement.nextSibling.value = clickedElement.childNodes[0].textContent;
          }
        });
    }
}
let todos = JSON.stringify(todosList.todos);
localStorage.setItem("todos", todos);

let localData = JSON.parse(localStorage.getItem("todos"))

// requirements v13

// save todos on localstorage everytime deleteall is run (x)
// create function that restores all todos (x)
// show undo button for some time after deleteAll (x)
