document.addEventListener("DOMContentLoaded", () => {
  if (window.authService.isAuthenticated()) {
    showTodoSection();
    loadTodos();
  } else {
    showAuthSection();
  }

  document.getElementById("login-form").addEventListener("submit", handleLogin);
  document.getElementById("register-form").addEventListener("submit", handleRegister);
  document.getElementById("logout-btn").addEventListener("click", handleLogout);
  document.getElementById("todo-form").addEventListener("submit", handleCreateTodo);
});

async function handleLogin(e) {
  e.preventDefault();
  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;

  try {
    await window.authService.login(email, password);
    showMessage("Login successful!", "success");
    showTodoSection();
    loadTodos();
  } catch (error) {
    showMessage(error.message, "error");
  }
}

async function handleRegister(e) {
  e.preventDefault();
  const email = document.getElementById("register-email").value;
  const password = document.getElementById("register-password").value;

  try {
    await window.authService.register(email, password);
    showMessage("Registration successful! Please login.", "success");
    document.getElementById("register-form").reset();
  } catch (error) {
    showMessage(error.message, "error");
  }
}

function handleLogout() {
  window.authService.logout();
  showMessage("Logged out successfully!", "success");
  showAuthSection();
}

async function handleCreateTodo(e) {
  e.preventDefault();
  const title = document.getElementById("todo-title").value;
  const description = document.getElementById("todo-description").value;

  try {
    await window.todoService.createTodo(title, description);
    showMessage("Todo created!", "success");
    document.getElementById("todo-form").reset();
    loadTodos();
  } catch (error) {
    showMessage(error.message, "error");
  }
}

async function loadTodos() {
  try {
    const todos = await window.todoService.getTodos();
    renderTodos(todos);
  } catch (error) {
    showMessage(error.message, "error");
  }
}

function renderTodos(todos) {
  const container = document.getElementById("todos-container");

  if (todos.length === 0) {
    container.innerHTML = "<p>No todos yet. Create your first todo above!</p>";
    return;
  }

  container.innerHTML = todos.map(todo => `
    <div class="todo-item ${todo.completed ? "completed" : ""}">
      <h3>${escapeHtml(todo.title)}</h3>
      ${todo.description ? `<p>${escapeHtml(todo.description)}</p>` : ""}
      <div class="todo-actions">
        <button onclick="toggleTodo(${todo.id}, ${!todo.completed})">
          ${todo.completed ? "Mark Incomplete" : "Mark Complete"}
        </button>
        <button onclick="editTodo(${todo.id}, '${escapeHtml(todo.title)}', '${escapeHtml(todo.description || "")}')">
          Edit
        </button>
        <button onclick="deleteTodo(${todo.id})">Delete</button>
      </div>
    </div>
  `).join('');
}

async function toggleTodo(id, completed) {
  try {
    await window.todoService.updateTodo(id, { completed });
    showMessage("Todo updated!", "success");
    loadTodos();
  } catch (error) {
    showMessage(error.message, "error");
  }
}

async function editTodo(id, title, description) {
  const newTitle = prompt("Edit title:", title);
  if (newTitle === null) return;

  const newDescription = prompt("Edit description:", description);
  if (newDescription === null) return;

  try {
    await window.todoService.updateTodo(id, { title: newTitle, description: newDescription });
    showMessage("Todo updated!", "success");
    loadTodos();
  } catch (error) {
    showMessage(error.message, "error");
  }
}

async function deleteTodo(id) {
  if (!confirm("Are you sure you want to delete this todo?")) return;

  try {
    await window.todoService.deleteTodo(id);
    showMessage("Todo deleted!", "success");
    loadTodos();
  } catch (error) {
    showMessage(error.message, "error");
  }
}

function showAuthSection() {
  document.getElementById("auth-section").style.display = "block";
  document.getElementById("todo-section").style.display = "none";
}

function showTodoSection() {
  document.getElementById("auth-section").style.display = "none";
  document.getElementById("todo-section").style.display = "block";
  const user = window.authService.getUser();
  if (user) {
    document.getElementById("user-email").textContent = user.email;
  }
}

function showMessage(message, type) {
  const messageEl = document.getElementById("message");
  messageEl.textContent = message;
  messageEl.className = `message ${type}`;
  setTimeout(() => {
    messageEl.textContent = "";
    messageEl.className = "message";
  }, 5000);
}

function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}
