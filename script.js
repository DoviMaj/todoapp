
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
        if(todoText !== ""){
            this.todos.push({
                todoText: todoText,
                completed: false
        });
        view.displayTodos();
        }
    },

    changeTodo: function(position, todoText){
        this.todos[position].todoText = todoText;
        view.displayTodos();
    },

    deleteTodo: function(position){
        this.todos.splice(position, 1);
        view.displayTodos();
    }, 
    
    deleteCompleted: function(){
        let todos = JSON.stringify(todosList.todos);
        localStorage.setItem("todos", todos);
        let todo = todosList.todos;
        for (var i= todo.length -1; i>=0; i--) {
            if(todo[i].completed === true){
                this.deleteTodo(i);
            }
         }
       this.restoreTodos();
    },

    restoreTodos: function() {
        let topButtons = document.getElementById("top-buttons");
        let restoreButton = document.createElement("span");
        restoreButton.addEventListener("click", function(){
            todosList.todos = JSON.parse(localStorage.getItem("todos"));;
            view.deleteCompletedButton();
            view.displayTodos();
        })
        restoreButton.innerText = "undo"
        topButtons.appendChild(restoreButton);

        setTimeout(function(){ restoreButton.remove(); }
        , 2000);
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
        view.deleteCompletedButton();
        view.displayTodos();
    },

    hasCompletedTodos: function(){
        let completedTodos = 0;

        this.todos.forEach(function(todos){
            if(todos.completed === true){
                completedTodos++;
            }
        })
        if(completedTodos > 0){
           return true;
        } else{
            return false;
        }
    }
}

let addTodoTextInput = document.getElementById("addTodoTextInput");

addTodoTextInput.addEventListener("keyup", function(event){
    if(event.keyCode === 13 && event.value !== ''){
        todosList.addTodo(addTodoTextInput.value);
        addTodoTextInput.value = ""
    }
});
 

let view = {
    displayTodos: function(){
    todosUl = document.querySelector("ul");
    todosUl.innerHTML = "";
    todosUl.className = "todosUl" ;
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

    deleteCompletedButton: function(){
        let deleteCompletedButton = document.createElement("li");
        let lowerButtons = document.querySelector('#top-buttons');

        deleteCompletedButton.id = "deleteCompletedButton";
        deleteCompletedButton.classList.add("styled-buttons")
        deleteCompletedButton.innerText = "Delete Completed";
        deleteCompletedButton.addEventListener('click', function(event){
            todosList.deleteCompleted();
            if(!todosList.hasCompletedTodos()){
                let deleteCompletedButton = document.querySelector('#deleteCompletedButton');
                deleteCompletedButton.parentNode.removeChild(deleteCompletedButton);
            }
        })
        let thereIsNoButtonYet = !document.querySelector("#deleteCompletedButton");
        if(todosList.hasCompletedTodos() && thereIsNoButtonYet){  
            lowerButtons.appendChild(deleteCompletedButton);
        }
        if(!todosList.hasCompletedTodos()){
            let deleteCompletedButton = document.querySelector('#deleteCompletedButton');
            deleteCompletedButton.parentNode.removeChild(deleteCompletedButton);
        }
        this.displayTodos();
    },
    
    showOnlyCompleted: function(){
        debugger;
        todosList.todos.forEach(function(todo, index){
            let todoLi = document.querySelectorAll('li.todosLi')
            if(!todo.completed){
                todoLi[index].classList.add("hide");
            }
            else{
                todoLi[index].classList.remove("hide");
            }
        })
    },

    showOnlyActive: function(){
        todosList.todos.forEach(function(todo, index){
            let todoLi = document.querySelectorAll('li.todosLi')
            if(todo.completed){
                todoLi[index].classList.add("hide");
            }else{
                todoLi[index].classList.remove("hide");
            }
        })
    },

    showAll: function(){
        todosList.todos.forEach(function(todo, index){
            let todoLi = document.querySelectorAll('li.todosLi')
                todoLi[index].classList.remove("hide");
        })
    },

    setUpEventListeners: function(){
        var todosUl = document.querySelector("ul");  

        todosUl.addEventListener("click", function(event) {
        let clickedElement = event.target;
        if(clickedElement.className === "deleteButton"){
            todosList.deleteTodo(clickedElement.parentNode.id);
          }
        if(clickedElement.className === "checkBox"){
            todosList.toggleCompleted(clickedElement.id);
            view.deleteCompletedButton();
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
