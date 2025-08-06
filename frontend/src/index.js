class TodoApp {
  constructor() {
    this.initializeApp();
    this.bindEvents();
  }

  initializeApp() {
    if (window.authService.isAuthenticated()) {
      this.showTodoSection();
      this.loadTodos();
    } else {
      this.showAuthSection();
    }
  }

  bindEvents() {
    document
      .getElementById("login-form")
      .addEventListener("submit", this.handleLogin.bind(this));
    document
      .getElementById("register-form")
      .addEventListener("submit", this.handleRegister.bind(this));
    document
      .getElementById("logout-btn")
      .addEventListener("click", this.handleLogout.bind(this));

    document
      .getElementById("todo-form")
      .addEventListener("submit", this.handleCreateTodo.bind(this));
  }

  async handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById("login-email").value;
    const password = document.getElementById("login-password").value;

    try {
      await window.authService.login(email, password);
      this.showMessage("Login successful!", "success");
      this.showTodoSection();
      this.loadTodos();
    } catch (error) {
      this.showMessage(error.message, "error");
    }
  }

  async handleRegister(e) {
    e.preventDefault();
    const email = document.getElementById("register-email").value;
    const password = document.getElementById("register-password").value;

    try {
      await window.authService.register(email, password);
      this.showMessage("Registration successful! Please login.", "success");
      document.getElementById("register-form").reset();
    } catch (error) {
      this.showMessage(error.message, "error");
    }
  }

  handleLogout() {
    window.authService.logout();
    this.showMessage("Logged out successfully!", "success");
    this.showAuthSection();
  }

  async handleCreateTodo(e) {
    e.preventDefault();
    const title = document.getElementById("todo-title").value;
    const description = document.getElementById("todo-description").value;

    try {
      await window.todoService.createTodo(title, description);
      this.showMessage("Todo created successfully!", "success");
      document.getElementById("todo-form").reset();
      this.loadTodos();
    } catch (error) {
      this.showMessage(error.message, "error");
    }
  }

  async loadTodos() {
    try {
      const todos = await window.todoService.getTodos();
      this.renderTodos(todos);
    } catch (error) {
      this.showMessage(error.message, "error");
    }
  }

  renderTodos(todos) {
    const container = document.getElementById("todos-container");

    if (todos.length === 0) {
      container.innerHTML =
        "<p>No todos yet. Create your first todo above!</p>";
      return;
    }

    container.innerHTML = todos
      .map(
        (todo) => `
            <div class="todo-item ${todo.completed ? "completed" : ""}">
                <h3>${this.escapeHtml(todo.title)}</h3>
                ${
                  todo.description
                    ? `<p>${this.escapeHtml(todo.description)}</p>`
                    : ""
                }
                <div class="todo-actions">
                    <button class="btn-complete" onclick="app.toggleTodo(${
                      todo.id
                    }, ${!todo.completed})">
                        ${todo.completed ? "Mark Incomplete" : "Mark Complete"}
                    </button>
                    <button class="btn-edit" onclick="app.editTodo(${
                      todo.id
                    }, '${this.escapeHtml(todo.title)}', '${this.escapeHtml(
          todo.description || ""
        )}')">
                        Edit
                    </button>
                    <button class="btn-delete" onclick="app.deleteTodo(${
                      todo.id
                    })">
                        Delete
                    </button>
                </div>
            </div>
        `
      )
      .join("");
  }

  async toggleTodo(id, completed) {
    try {
      await window.todoService.updateTodo(id, { completed });
      this.showMessage("Todo updated!", "success");
      this.loadTodos();
    } catch (error) {
      this.showMessage(error.message, "error");
    }
  }

  async editTodo(id, currentTitle, currentDescription) {
    const newTitle = prompt("Edit title:", currentTitle);
    if (newTitle === null) return;

    const newDescription = prompt("Edit description:", currentDescription);
    if (newDescription === null) return;

    try {
      await window.todoService.updateTodo(id, {
        title: newTitle,
        description: newDescription,
      });
      this.showMessage("Todo updated!", "success");
      this.loadTodos();
    } catch (error) {
      this.showMessage(error.message, "error");
    }
  }

  async deleteTodo(id) {
    if (!confirm("Are you sure you want to delete this todo?")) {
      return;
    }

    try {
      await window.todoService.deleteTodo(id);
      this.showMessage("Todo deleted!", "success");
      this.loadTodos();
    } catch (error) {
      this.showMessage(error.message, "error");
    }
  }

  showAuthSection() {
    document.getElementById("auth-section").style.display = "block";
    document.getElementById("todo-section").style.display = "none";
  }

  showTodoSection() {
    document.getElementById("auth-section").style.display = "none";
    document.getElementById("todo-section").style.display = "block";

    const user = window.authService.getUser();
    if (user) {
      document.getElementById("user-email").textContent = user.email;
    }
  }

  showMessage(message, type) {
    const messageEl = document.getElementById("message");
    messageEl.textContent = message;
    messageEl.className = `message ${type}`;

    setTimeout(() => {
      messageEl.textContent = "";
      messageEl.className = "message";
    }, 5000);
  }

  escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  window.app = new TodoApp();
});
