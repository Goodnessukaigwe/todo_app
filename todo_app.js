let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let editingId = null;
let taskToDelete = null;

const TODO_INPUT = document.getElementById('todoInput');
const TODO_FORM = document.getElementById('todoForm');
const TASK_LIST = document.getElementById('todoList');
const DELETE_MODAL = document.getElementById('deleteModal');
const CONFIRM_DELETE_BTN = document.getElementById('confirmDelete');
const CANCEL_DELETE_BTN = document.getElementById('cancelDelete');
const ADD_BUTTON = document.querySelector('button[type="submit"]');
const NO_TASKS_MESSAGE = document.getElementById('noTasksMessage');

function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function updateAddButtonState() {
  const text = TODO_INPUT.value.trim();
  ADD_BUTTON.disabled = text === '';
}

function renderTasks() {
  TASK_LIST.innerHTML = '';
  
  if (tasks.length === 0) {
    NO_TASKS_MESSAGE.style.display = 'block';
  } else {
    NO_TASKS_MESSAGE.style.display = 'none';
  }
  
  tasks.forEach(task => {
    const li = document.createElement('li');
    li.className = 'todo-item' + (task.completed ? ' completed' : '');

    if (editingId === task.id) {
      li.innerHTML = `
        <input type="text" id="edit-${task.id}" value="${task.text}" />
        <button onclick="updateTask(${task.id})">Save</button>
        <button onclick="cancelEdit()">Cancel</button>
      `;
    } else {
      li.innerHTML = `
        <span onclick="toggleComplete(${task.id})">${task.text}</span>
        <div>
          <button onclick="editTask(${task.id})">Edit</button>
          <button class="delete-btn" onclick="deleteTask(${task.id})">Delete</button>
        </div>
      `;
    }

    TASK_LIST.appendChild(li);
  });
}

function addTask() {
  const text = TODO_INPUT.value.trim();
  if (!text) {
    alert('Please enter a task!');
    return;
  }

  tasks.push({ id: Date.now(), text, completed: false });
  TODO_INPUT.value = '';
  updateAddButtonState();
  saveTasks();
  renderTasks();
}

function deleteTask(taskId) {
  taskToDelete = taskId;
  showDeleteModal();
}

function showDeleteModal() {
  DELETE_MODAL.style.display = 'block';
}

function hideDeleteModal() {
  DELETE_MODAL.style.display = 'none';
  taskToDelete = null;
}

function confirmDelete() {
  if (taskToDelete) {
    tasks = tasks.filter(task => task.id !== taskToDelete);
    saveTasks();
    renderTasks();
    hideDeleteModal();
  }
}

function toggleComplete(taskId) {
  tasks = tasks.map(task =>
    task.id === taskId ? { ...task, completed: !task.completed } : task
  );
  saveTasks();
  renderTasks();
}

function editTask(taskId) {
  editingId = taskId;
  renderTasks();
}

function updateTask(taskId) {
  const input = document.getElementById(`edit-${taskId}`);
  const NEW_TASK = input.value.trim();
  if (!NEW_TASK) return alert('Task cannot be empty.');

  tasks = tasks.map(task =>
    task.id === taskId ? { ...task, text: NEW_TASK } : task
  );

  editingId = null;
  saveTasks();
  renderTasks();
}

function cancelEdit() {
  editingId = null;
  renderTasks();
}

TODO_FORM.addEventListener('submit', function(event) {
  event.preventDefault();
  addTask();
});

TODO_INPUT.addEventListener('input', updateAddButtonState);

// Modal event listeners
CONFIRM_DELETE_BTN.addEventListener('click', confirmDelete);
CANCEL_DELETE_BTN.addEventListener('click', hideDeleteModal);

// Close modal when clicking outside of it
DELETE_MODAL.addEventListener('click', function(event) {
  if (event.target === DELETE_MODAL) {
    hideDeleteModal();
  }
});

renderTasks();
updateAddButtonState();
