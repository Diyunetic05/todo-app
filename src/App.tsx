import { useState } from 'react';
import TodoInput from './components/TodoInput';
import TodoList from './components/TodoList';
import TodoFilter from './components/TodoFilter';
import './App.css';

// TypeScript Interface for a Todo item
interface Todo {
  id: number;
  text: string;
  completed: boolean;
  createdAt: Date;
}

function App() {
  // State for todos list (In-memory storage)
  const [todos, setTodos] = useState<Todo[]>([
    { id: 1, text: 'Learn React', completed: false, createdAt: new Date() },
    { id: 2, text: 'Build a Todo App', completed: false, createdAt: new Date() },
    { id: 3, text: 'Master TypeScript', completed: false, createdAt: new Date() },
  ]);


  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');

  // Callback: Add a new todo (passed down to TodoInput)
  const handleAddTodo = (text: string) => {
    const newTodo: Todo = {
      id: Date.now(),
      text: text,
      completed: false,
      createdAt: new Date(),
    };
    setTodos([...todos, newTodo]);
  };

  // Callback: Toggle todo completion (passed down to TodoItem)
  const handleToggleTodo = (id: number) => {
    setTodos(
      todos.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  // Callback: Delete a todo (passed down to TodoItem)
  const handleDeleteTodo = (id: number) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      setTodos(todos.filter(todo => todo.id !== id));
    }
  };

  // Callback: Edit a todo (passed down to TodoItem)
  const handleEditTodo = (id: number, newText: string) => {
    setTodos(
      todos.map(todo =>
        todo.id === id ? { ...todo, text: newText } : todo
      )
    );
  };

  // Callback: Clear all completed todos
  const handleClearCompleted = () => {
    const completedCount = todos.filter(t => t.completed).length;
    if (completedCount > 0 && window.confirm(`Delete ${completedCount} completed tasks?`)) {
      setTodos(todos.filter(todo => !todo.completed));
    }
  };

  // Get statistics
  const getStats = () => {
    const total = todos.length;
    const completed = todos.filter(todo => todo.completed).length;
    const active = total - completed;
    return { total, completed, active };
  };

  const stats = getStats();

  return (
    <div className="todo-container">
      <div className="todo-card">
        <h1>
          <span>📝</span>
          Todo App
        </h1>

        {/* TodoInput Component - receives onAddTodo callback */}
        <TodoInput onAddTodo={handleAddTodo} />

        {/* TodoFilter Component - receives filter and onFilterChange */}
        <TodoFilter
          filter={filter}
          onFilterChange={setFilter}
          stats={stats}
        />

        {/* TodoList Component - receives todos and callbacks */}
        <TodoList
          todos={todos}
          filter={filter}
          onToggle={handleToggleTodo}
          onDelete={handleDeleteTodo}
          onEdit={handleEditTodo}
        />

        {/* Footer */}
        {todos.length > 0 && (
          <div className="footer">
            <div className="stats">
              📊 {stats.active} task{stats.active !== 1 ? 's' : ''} remaining
            </div>
            {stats.completed > 0 && (
              <button onClick={handleClearCompleted} className="clear-btn">
                Clear Completed ({stats.completed})
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;