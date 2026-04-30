import { useState, useEffect } from 'react';
import useLocalStorage from './hooks/useLocalStorage';
import useFetch from './hooks/useFetch';
import useDebounce from './hooks/useDebounce';
import './App.css';

interface Todo {
  id: number;
  text: string;
  completed: boolean;
  createdAt: Date;
  fromAPI?: boolean;
}

interface ApiTodo {
  id: number;
  title: string;
  completed: boolean;
  userId: number;
}

function App() {
  // ========== USING CUSTOM HOOKS ==========

  // 1. useLocalStorage - Start with empty todos (or clear them)
  const [todos, setTodos, clearTodos] = useLocalStorage<Todo[]>('todos', []);

  // 2. useFetch - Fetch sample todos from API
  const {
    data: apiTodos,
    loading: apiLoading,
    error: apiError,
    refetch: refetchApi
  } = useFetch<ApiTodo[]>('https://jsonplaceholder.typicode.com/todos?_limit=5');

  // 3. useDebounce - For search functionality
  const [searchTerm, setSearchTerm] = useState<string>('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [inputValue, setInputValue] = useState<string>('');
  const [showApiSection, setShowApiSection] = useState<boolean>(true);

  // Add default todos if empty
  const addDefaultTodos = () => {
    const defaultTodos: Todo[] = [
      { id: 101, text: 'Learn React', completed: false, createdAt: new Date() },
      { id: 102, text: 'Build a Todo App', completed: false, createdAt: new Date() },
      { id: 103, text: 'Master TypeScript', completed: false, createdAt: new Date() },
    ];
    setTodos(defaultTodos);
  };

  // Add a new todo
  const handleAddTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() === '') return;

    const newTodo: Todo = {
      id: Date.now(),
      text: inputValue,
      completed: false,
      createdAt: new Date(),
    };
    setTodos([...todos, newTodo]);
    setInputValue('');
  };

  // Toggle todo completion
  const handleToggleTodo = (id: number) => {
    setTodos(
      todos.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  // Delete a todo
  const handleDeleteTodo = (id: number) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      setTodos(todos.filter(todo => todo.id !== id));
    }
  };

  // Edit a todo
  const handleEditTodo = (id: number, newText: string) => {
    setTodos(
      todos.map(todo =>
        todo.id === id ? { ...todo, text: newText } : todo
      )
    );
  };

  // Clear all todos
  const handleClearAll = () => {
    if (window.confirm('⚠️ Delete ALL todos? This cannot be undone!')) {
      clearTodos();
    }
  };

  // Clear completed todos
  const handleClearCompleted = () => {
    const completedCount = todos.filter(t => t.completed).length;
    if (completedCount > 0 && window.confirm(`Delete ${completedCount} completed tasks?`)) {
      setTodos(todos.filter(todo => !todo.completed));
    }
  };

  // Import todos from API
  const handleImportFromAPI = () => {
    if (apiTodos && apiTodos.length > 0) {
      const newTodos: Todo[] = apiTodos.map(apiTodo => ({
        id: apiTodo.id + 1000,
        text: apiTodo.title,
        completed: apiTodo.completed,
        createdAt: new Date(),
        fromAPI: true
      }));

      const existingTexts = new Set(todos.map(t => t.text));
      const uniqueNewTodos = newTodos.filter(todo => !existingTexts.has(todo.text));

      if (uniqueNewTodos.length > 0) {
        setTodos([...todos, ...uniqueNewTodos]);
        alert(`✅ Imported ${uniqueNewTodos.length} todos from API!`);
      } else {
        alert('All API todos already exist in your list!');
      }
    }
  };

  // Filter and Search todos (using debounced search term)
  const filteredTodos = todos
    .filter(todo => {
      if (filter === 'active') return !todo.completed;
      if (filter === 'completed') return todo.completed;
      return true;
    })
    .filter(todo => {
      if (debouncedSearchTerm === '') return true;
      return todo.text.toLowerCase().includes(debouncedSearchTerm.toLowerCase());
    });

  const stats = {
    total: todos.length,
    completed: todos.filter(t => t.completed).length,
    active: todos.filter(t => !t.completed).length,
    searchResults: filteredTodos.length
  };

  const formatDate = (date: Date) => {
    const d = new Date(date);
    return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
  };

  return (
    <div className="todo-container">
      <div className="todo-card">
        <h1>
          <span>📝</span>
          Todo App with Custom Hooks
        </h1>

        {/* Custom Hooks Badges */}
        <div className="hooks-badge">
          <span className="badge">🪝 useLocalStorage</span>
          <span className="badge">📡 useFetch</span>
          <span className="badge">🕐 useDebounce</span>
          <span className="badge">💾 Persists after refresh</span>
        </div>

        {/* ========== SEARCH BAR - AT THE TOP (as shown in image) ========== */}
        <div className="search-section">
          <div className="search-input-wrapper">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              className="search-input"
              placeholder="Search todos... (typing waits 500ms)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button className="clear-search" onClick={() => setSearchTerm('')}>
                ✖
              </button>
            )}
          </div>
          {searchTerm && (
            <div className="search-info">
              🔍 Found {stats.searchResults} result{stats.searchResults !== 1 ? 's' : ''} for "{searchTerm}"
            </div>
          )}
        </div>

        {/* Add Default Todos Button (if empty) */}
        {todos.length === 0 && (
          <div style={{ marginBottom: '20px' }}>
            <button
              onClick={addDefaultTodos}
              style={{
                width: '100%',
                padding: '10px',
                background: '#e8e8e8',
                border: '1px solid #ccc',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              📋 Add Sample Todos (Learn React, Build Todo App, Master TypeScript)
            </button>
          </div>
        )}

        {/* ========== API FETCH SECTION ========== */}
        {showApiSection && (
          <div className="api-section">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3>📡 Fetch Sample Todos from API</h3>
              <button
                onClick={() => setShowApiSection(false)}
                style={{ background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer', color: '#999' }}
              >
                ✖
              </button>
            </div>
            <div className="api-buttons">
              <button onClick={refetchApi} className="api-refetch-btn" disabled={apiLoading}>
                🔄 {apiLoading ? 'Loading...' : 'Refetch'}
              </button>
              <button onClick={handleImportFromAPI} className="api-import-btn" disabled={apiLoading || !apiTodos}>
                📥 Import to My Todos
              </button>
            </div>

            {apiLoading && <p className="api-loading">⏳ Loading todos from API...</p>}
            {apiError && <p className="api-error">❌ Error: {apiError}</p>}

            {apiTodos && !apiLoading && (
              <div className="api-preview">
                <h4>API Preview (Click Import to add)</h4>
                <ul>
                  {apiTodos.map(todo => (
                    <li key={todo.id}>
                      <span>{todo.title.length > 50 ? todo.title.substring(0, 50) + '...' : todo.title}</span>
                      <span className={todo.completed ? 'api-completed' : 'api-pending'}>
                        {todo.completed ? '✓ Done' : '○ Pending'}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* ========== ADD TODO FORM ========== */}
        <form onSubmit={handleAddTodo} className="add-todo">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="What needs to be done?"
          />
          <button type="submit">+ Add Task</button>
        </form>

        {/* ========== FILTER BUTTONS ========== */}
        <div className="filters">
          <button onClick={() => setFilter('all')} className={filter === 'all' ? 'active' : ''}>
            All ({stats.total})
          </button>
          <button onClick={() => setFilter('active')} className={filter === 'active' ? 'active' : ''}>
            Active ({stats.active})
          </button>
          <button onClick={() => setFilter('completed')} className={filter === 'completed' ? 'active' : ''}>
            Completed ({stats.completed})
          </button>
        </div>

        {/* ========== TODO LIST HEADER ========== */}
        <div className="todo-list">
          <h4 style={{ fontSize: '13px', color: '#666', marginBottom: '10px', borderBottom: '1px solid #e5e5e5', paddingBottom: '8px' }}>
            📋 My Tasks ({filteredTodos.length})
          </h4>
          {filteredTodos.length === 0 ? (
            <p className="empty-message">
              {todos.length === 0
                ? "✨ No todos! Add a task above or import from API"
                : searchTerm
                  ? `No tasks match "${searchTerm}"`
                  : "No todos match the selected filter"}
            </p>
          ) : (
            filteredTodos.map(todo => (
              <div key={todo.id} className={`todo-item ${todo.completed ? 'completed' : ''}`}>
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => handleToggleTodo(todo.id)}
                />
                <span className="todo-text">{todo.text}</span>
                {todo.fromAPI && <span className="api-badge">API</span>}
                <span className="todo-date">{formatDate(todo.createdAt)}</span>
                <button
                  className="edit-btn"
                  onClick={() => {
                    const newText = prompt('Edit todo:', todo.text);
                    if (newText && newText.trim()) handleEditTodo(todo.id, newText);
                  }}
                >
                  ✏️
                </button>
                <button className="delete-btn" onClick={() => handleDeleteTodo(todo.id)}>
                  🗑️
                </button>
              </div>
            ))
          )}
        </div>

        {/* ========== FOOTER ========== */}
        {todos.length > 0 && (
          <div className="footer">
            <div className="stats">
              📊 {stats.active} task{stats.active !== 1 ? 's' : ''} remaining
              <span className="persist-info">💾 Saved in localStorage</span>
            </div>
            <div className="footer-buttons">
              {stats.completed > 0 && (
                <button onClick={handleClearCompleted} className="clear-completed-btn">
                  Clear Completed ({stats.completed})
                </button>
              )}
              <button onClick={handleClearAll} className="clear-all-btn">
                🗑️ Clear All
              </button>
            </div>
          </div>
        )}

        {/* ========== LOCALSTORAGE INFO ========== */}
        <div className="localstorage-footer">
          <details>
            <summary>🔍 View localStorage Data</summary>
            <div className="localstorage-info">
              <p>✅ Your todos are saved in browser's localStorage!</p>
              <p>📀 Key: <code>'todos'</code></p>
              <p>🔧 To view: F12 → Application → Local Storage</p>
              <button onClick={() => console.log('Current todos:', todos)}>
                📝 Log Todos to Console
              </button>
            </div>
          </details>
        </div>
      </div>
    </div>
  );
}

export default App;