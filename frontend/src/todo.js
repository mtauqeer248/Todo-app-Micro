class TodoService {
    constructor() {
        this.baseUrl = 'http://localhost:3002/api/todos';
    }

    getAuthHeaders() {
        const token = window.authService.getToken();
        return {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        };
    }

    async getTodos() {
        try {
            const response = await fetch(this.baseUrl, {
                headers: this.getAuthHeaders(),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to fetch todos');
            }

            return data.todos;
        } catch (error) {
            throw error;
        }
    }

    async createTodo(title, description = '') {
        try {
            const response = await fetch(this.baseUrl, {
                method: 'POST',
                headers: this.getAuthHeaders(),
                body: JSON.stringify({ title, description }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to create todo');
            }

            return data.todo;
        } catch (error) {
            throw error;
        }
    }

    async updateTodo(id, updates) {
        try {
            const response = await fetch(`${this.baseUrl}/${id}`, {
                method: 'PUT',
                headers: this.getAuthHeaders(),
                body: JSON.stringify(updates),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to update todo');
            }

            return data.todo;
        } catch (error) {
            throw error;
        }
    }

    async deleteTodo(id) {
        try {
            const response = await fetch(`${this.baseUrl}/${id}`, {
                method: 'DELETE',
                headers: this.getAuthHeaders(),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Failed to delete todo');
            }

            return true;
        } catch (error) {
            throw error;
        }
    }
}

// Create global todo service instance
window.todoService = new TodoService();