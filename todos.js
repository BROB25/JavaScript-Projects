// Model
/* If localstorage has a todos array, then use it. Otherwise, use the default array. */
let todos;

// Retrieve localStorage
const savedTodos = JSON.parse(localStorage.getItem('todos'));

// Check if it's an array
if (Array.isArray(savedTodos)) {
  todos = savedTodos;
} else {
  todos = [{
    title: 'Get groceries', 
    dueDate: '2023-03-06',
    id: 'id1'
  }, {
    title: 'Wash car',
    dueDate: '2023-03-10',
    id: 'id2'
  }, {
    title: 'Make dinner',
    dueDate: '2023-03-06',
    id: 'id3'
  }];
}

// Creates a todo
const createTodo = (title, dueDate) => {
  const id = '' + new Date().getTime();

  todos.push({
    title: title,
    dueDate: dueDate,
    id: id
  });

  saveTodos();
}

// Deletes a todo
const removeTodo = idToDelete => {
  todos = todos.filter(todo => {
    /* if the id of this todo matches idToDelete, return False. For everything else, return True */
    if (todo.id === idToDelete) {
      return false;
    } else {
      return true;
    }
  });

  saveTodos();
}

const setEditing = (todoId) => {
  todos.forEach((todo) => {
    if (todo.id === todoId) {
      todo.isEditing = true;
    }
  });

  saveTodos();
}

const updateTodo = (todoId, newTitle, newDate) => {
  todos.forEach((todo) => {
    if (todo.id === todoId) {
      todo.title = newTitle;
      todo.dueDate = newDate;
      todo.isEditing = false;
    }
  });

  saveTodos();
}

const saveTodos = () => {
  localStorage.setItem('todos', JSON.stringify(todos));
}

const toggleTodo = (todoId, checked) => {
  todos.forEach(todo => {
    if (todo.id === todoId) {
      todo.isDone = checked;
    }
  });
}

// Controller
const addTodo = () => {
  const textbox = document.getElementById('todo-title');
  const title = textbox.value;

  const datePicker = document.getElementById('date-picker');
  const dueDate = datePicker.value;

  createTodo(title, dueDate);
  render();
}

const deleteTodo = event => {
  const deleteButton = event.target;
  const idToDelete = deleteButton.id;

  removeTodo(idToDelete);
  render();
}

const onEdit = (event) => {
  const editButton = event.target;
  const todoId = editButton.dataset.todoId;

  setEditing(todoId);
  render();
}

const onUpdate = (event) => {
  const updateButton = event.target;
  const todoId = updateButton.dataset.todoId;

  const textbox = document.getElementById('edit-title-' + todoId);
  const newTitle = textbox.value;

  const datePicker = document.getElementById('edit-date-' + todoId);
  const newDate = datePicker.value;

  updateTodo(todoId, newTitle, newDate);
  render();
}

const checkTodo = event => {
  const checkbox = event.target;
  
  const todoId = checkbox.dataset.todoId;
  const checked = checkbox.checked;

  toggleTodo(todoId, checked);
  render();
}

// View 
const render = () => {
  // resets list
  document.getElementById('todo-list').innerHTML = '';

  // sorts todos by due date
  todos.sort((a, b) => {
    return new Date(a.dueDate) - new Date(b.dueDate);
  });

  todos.forEach(todo => {
    const element = document.createElement('div');
    element.innerText = todo.title + ' ' + todo.dueDate;

    if (todo.isEditing === true) {
      const textbox = document.createElement('input');
      textbox.type = 'text';
      textbox.style = 'margin-left: 6px;'
      textbox.id = 'edit-title-' + todo.id;
      element.appendChild(textbox);

      const datePicker = document.createElement('input');
      datePicker.type = 'date';
      datePicker.style = 'margin-left: 6px;'
      datePicker.id = 'edit-date-' + todo.id;
      element.appendChild(datePicker);

      const updateButton = document.createElement('button');
      updateButton.innerText = 'Update';
      updateButton.style = 'margin-left: 12px; background-color: rgb(55, 190, 34); border: solid black 1px; padding: 3px 6px;'
      updateButton.dataset.todoId = todo.id;
      updateButton.onclick = onUpdate;
      element.appendChild(updateButton);
    } else {
      element.innerText = todo.title + ' ' + todo.dueDate;
      
      const editButton = document.createElement('button');
      editButton.innerText = 'Edit';
      editButton.style = 'margin-left: 12px; background-color: orange; border: solid black 1px; padding: 3px 6px;';
      editButton.onclick = onEdit;
      editButton.dataset.todoId = todo.id;
      element.appendChild(editButton);

      const deleteButton = document.createElement('button');
      deleteButton.innerText = 'Delete';
      deleteButton.style = 'margin-left: 12px; background-color: red; border: solid black 1px; padding: 3px 6px;';
      deleteButton.onclick = deleteTodo;
      deleteButton.id = todo.id;
      element.appendChild(deleteButton);
    }

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.onchange = checkTodo;
    checkbox.dataset.todoId = todo.id;
    if (todo.isDone === true) {
      checkbox.checked = true;
    } else {
      checkbox.checked = false;
    }
    element.prepend(checkbox)

    const todoList = document.getElementById('todo-list');
    todoList.appendChild(element);
  });
}

render();