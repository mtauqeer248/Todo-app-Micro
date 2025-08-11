
let editingTodoId = null;
let deletingTodoId = null;

document.addEventListener('DOMContentLoaded', () => {
    initApp();
    bindEvents();
});

function initApp() {
    if (window.authService.isAuthenticated()) {
        showTodoSection();
        loadTodos();
    } else {
        showAuthSection();
    }
}

function bindEvents() {
    document.getElementById('login-form').addEventListener('submit', handleLogin);
    document.getElementById('register-form').addEventListener('submit', handleRegister);
    document.getElementById('logout-btn').addEventListener('click', handleLogout);
    document.getElementById('todo-form').addEventListener('submit', handleCreateTodo);
    document.getElementById('edit-form').addEventListener('submit', handleEditSave);
    document.getElementById('edit-cancel').addEventListener('click', () => toggleModal('edit-modal', false));
    document.getElementById('delete-confirm').addEventListener('click', handleDeleteConfirm);
    document.getElementById('delete-cancel').addEventListener('click', () => toggleModal('delete-modal', false));
}


async function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    try {
        await window.authService.login(email, password);
        showMessage('Login successful!', 'success');
        showTodoSection();
        loadTodos();
    } catch (error) {
        showMessage(error.message, 'error');
    }
}

async function handleRegister(e) {
    e.preventDefault();
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;

    try {
        await window.authService.register(email, password);
        showMessage('Registration successful! Please login.', 'success');
        document.getElementById('register-form').reset();
    } catch (error) {
        showMessage(error.message, 'error');
    }
}

function handleLogout() {
    window.authService.logout();
    showMessage('Logged out successfully!', 'success');
    showAuthSection();
}


async function handleCreateTodo(e) {
    e.preventDefault();
    const title = document.getElementById('todo-title').value;
    const description = document.getElementById('todo-description').value;

    try {
        await window.todoService.createTodo(title, description);
        showMessage('Todo created successfully!', 'success');
        document.getElementById('todo-form').reset();
        loadTodos();
    } catch (error) {
        showMessage(error.message, 'error');
    }
}

async function loadTodos() {
    try {
        const todos = await window.todoService.getTodos();
        renderTodos(todos);
    } catch (error) {
        showMessage(error.message, 'error');
    }
}

function renderTodos(todos) {
    const container = document.getElementById('todos-container');

    if (todos.length === 0) {
        container.innerHTML = '<p>No todos yet. Create your first todo above!</p>';
        return;
    }

    container.innerHTML = todos.map(todo => `
        <div class="todo-item ${todo.completed ? 'completed' : ''}">
            <h3>${escapeHtml(todo.title)}</h3>
            ${todo.description ? `<p>${escapeHtml(todo.description)}</p>` : ''}
            <div class="todo-actions">
                <button class="btn-complete" onclick="toggleTodo(${todo.id}, ${!todo.completed})">
                    ${todo.completed ? 'Mark Incomplete' : 'Mark Complete'}
                </button>
                <button class="btn-edit" onclick="openEditModal(${todo.id}, '${escapeHtml(todo.title)}', '${escapeHtml(todo.description || '')}')">
                    Edit
                </button>
                <button class="btn-delete" onclick="openDeleteModal(${todo.id})">
                    Delete
                </button>
            </div>
        </div>
    `).join('');
}

async function toggleTodo(id, completed) {
    try {
        await window.todoService.updateTodo(id, { completed });
        showMessage('Todo updated!', 'success');
        loadTodos();
    } catch (error) {
        showMessage(error.message, 'error');
    }
}

function openEditModal(id, currentTitle, currentDescription) {
    editingTodoId = id;
    document.getElementById('edit-title').value = currentTitle;
    document.getElementById('edit-description').value = currentDescription;
    toggleModal('edit-modal', true);
}

async function handleEditSave(e) {
    e.preventDefault();
    const title = document.getElementById('edit-title').value;
    const description = document.getElementById('edit-description').value;

    try {
        await window.todoService.updateTodo(editingTodoId, { title, description });
        showMessage('Todo updated!', 'success');
        toggleModal('edit-modal', false);
        loadTodos();
    } catch (error) {
        showMessage(error.message, 'error');
    }
}

function openDeleteModal(id) {
    deletingTodoId = id;
    toggleModal('delete-modal', true);
}

async function handleDeleteConfirm() {
    try {
        await window.todoService.deleteTodo(deletingTodoId);
        showMessage('Todo deleted!', 'success');
        toggleModal('delete-modal', false);
        loadTodos();
    } catch (error) {
        showMessage(error.message, 'error');
    }
}

function toggleModal(id, show) {
    document.getElementById(id).style.display = show ? 'flex' : 'none';
}

function showAuthSection() {
    document.getElementById('auth-section').style.display = 'block';
    document.getElementById('todo-section').style.display = 'none';
}

function showTodoSection() {
    document.getElementById('auth-section').style.display = 'none';
    document.getElementById('todo-section').style.display = 'block';

    const user = window.authService.getUser();
    if (user) {
        document.getElementById('user-email').textContent = user.email;
    }
}

function showMessage(message, type) {
    const messageEl = document.getElementById('message');
    messageEl.textContent = message;
    messageEl.className = `message ${type}`;
    setTimeout(() => {
        messageEl.textContent = '';
        messageEl.className = 'message';
    }, 5000);
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
