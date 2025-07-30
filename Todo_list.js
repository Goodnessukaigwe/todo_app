let todos = JSON.parse(localStorage.getItem('todos')) || [];
let editingId = null;

const todoInput = document.getElementById('todoInput');
const todoList = document.getElementById('todoList');

function saveTodos() {
  localStorage.setItem('todos', JSON.stringify(todos));
}

function renderTodos() {
  todoList.innerHTML = '';
  todos.forEach(todo => {
    const li = document.createElement('li');
    li.className = 'todo-item' + (todo.completed ? ' completed' : '');

    if (editingId === todo.id) {
      li.innerHTML = `
        <input type="text" id="edit-${todo.id}" value="${todo.text}" />
        <button onclick="saveEdit(${todo.id})">Save</button>
        <button onclick="cancelEdit()">Cancel</button>
      `;
    } else {
      li.innerHTML = `
        <span onclick="toggleComplete(${todo.id})">${todo.text}</span>
        <div>
          <button onclick="startEdit(${todo.id})">Edit</button>
          <button onclick="deleteTodo(${todo.id})">Delete</button>
        </div>
      `;
    }

    todoList.appendChild(li);
  });
}

function addTodo() {
  const text = todoInput.value.trim();
  if (!text) {
    alert('Please enter a task!');
    return;
  }

  todos.push({ id: Date.now(), text, completed: false });
  todoInput.value = '';
  saveTodos();
  renderTodos();
}

function deleteTodo(id) {
  todos = todos.filter(todo => todo.id !== id);
  saveTodos();
  renderTodos();
}

function toggleComplete(id) {
  todos = todos.map(todo =>
    todo.id === id ? { ...todo, completed: !todo.completed } : todo
  );
  saveTodos();
  renderTodos();
}

function startEdit(id) {
  editingId = id;
  renderTodos();
}

function saveEdit(id) {
  const input = document.getElementById(`edit-${id}`);
  const newText = input.value.trim();
  if (!newText) return alert('Task cannot be empty.');

  todos = todos.map(todo =>
    todo.id === id ? { ...todo, text: newText } : todo
  );

  editingId = null;
  saveTodos();
  renderTodos();
}

function cancelEdit() {
  editingId = null;
  renderTodos();
}

todoInput.addEventListener('keypress', function(e) {
  if (e.key === 'Enter') {
    addTodo();
  }
});

renderTodos();
