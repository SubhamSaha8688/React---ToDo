import axios from 'axios';

const baseURL = 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json'
  }
});

const api = {
  // Get all todos
  getTodos: () => apiClient.get('/todos'),
  
  // Get a single todo
  getTodo: (id) => apiClient.get(`/todos/${id}`),
  
  // Create a new todo
  createTodo: (todoData) => apiClient.post('/todos', todoData),
  
  // Update a todo
  updateTodo: (id, todoData) => apiClient.put(`/todos/${id}`, todoData),
  
  // Delete a todo
  deleteTodo: (id) => apiClient.delete(`/todos/${id}`)
};

export default api;