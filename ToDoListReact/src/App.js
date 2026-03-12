import React, { useEffect, useState } from 'react';
import { FaTrash, FaCheckCircle, FaCircle } from 'react-icons/fa';
import service from './service.js';

function App() {
  const [newTodo, setNewTodo] = useState("");
  const [todos, setTodos] = useState([]);

  async function getTodos() {
    const todos = await service.getTasks();
    setTodos(todos);
  }

  async function createTodo(e) {
    if (e.key === 'Enter' && newTodo.trim()) {
      e.preventDefault();
      await service.addTask(newTodo);
      setNewTodo("");//clear input
      await getTodos();//refresh tasks list (in order to see the new one)
    }
  }

  async function updateCompleted(todo, isComplete) {
    await service.setCompleted(todo, isComplete);
    await getTodos();//refresh tasks list (in order to see the updated one)
  }

  async function deleteTodo(id) {
    await service.deleteTask(id);
    await getTodos();//refresh tasks list
  }

  useEffect(() => {
    getTodos();
  }, []);

  return (
    <div className="app-wrapper">
      {/* Main Title - WOW Header */}
      <div className="main-title-container">
        <h1 className="main-title">✨ Todos ✨</h1>
        <div className="title-decoration"></div>
      </div>
      
      <div className="app-container">
        {/* Header */}
        <header className="app-header">
          <h2 className="app-title">Task Manager</h2>
        </header>

        {/* Main Content */}
        <main className="app-main">
          {/* Premium Search Bar Input */}
          <div className="input-section">
            <input 
              type="text"
              className="premium-input" 
              placeholder="Well, let's take on the day" 
              value={newTodo} 
              onChange={(e) => setNewTodo(e.target.value)}
              onKeyDown={createTodo}
            />
          </div>

          {/* Tasks List */}
          <div className="tasks-container">
            {todos.length === 0 ? (
              <div className="no-tasks">
                <div className="no-tasks-icon">📝</div>
                <p>No tasks yet. Create one to get started!</p>
              </div>
            ) : (
              todos.map((todo, index) => (
                <div 
                  key={todo.id} 
                  className={`task-card ${todo.isComplete ? 'completed' : ''}`}
                  style={{ '--delay': `${index * 0.05}s` }}
                >
                  <div className="task-content">
                    <button
                      className="checkbox-button"
                      onClick={() => updateCompleted(todo, !todo.isComplete)}
                      title={todo.isComplete ? "Mark as incomplete" : "Mark as complete"}
                      aria-label="Toggle task completion"
                    >
                      {todo.isComplete ? (
                        <FaCheckCircle className="icon-checked" />
                      ) : (
                        <FaCircle className="icon-unchecked" />
                      )}
                    </button>
                    <span className="task-text">{todo.name}</span>
                  </div>
                  <button 
                    className="delete-button" 
                    onClick={() => deleteTodo(todo.id)}
                    title="Delete task"
                    aria-label="Delete task"
                  >
                    <FaTrash />
                  </button>
                </div>
              ))
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;