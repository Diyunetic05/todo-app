import { useState, useEffect } from 'react';
import useLocalStorage from './hooks/useLocalStorage';
import useFetch from './hooks/useFetch';
import useDebounce from './hooks/useDebounce';

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
  const [todos, setTodos, clearTodos] = useLocalStorage<Todo[]>('todos', []);
  const {
    data: apiTodos,
    loading: apiLoading,
    error: apiError,
    refetch: refetchApi
  } = useFetch<ApiTodo[]>('https://jsonplaceholder.typicode.com/todos?_limit=5');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [inputValue, setInputValue] = useState<string>('');
  const [showApiSection, setShowApiSection] = useState<boolean>(true);
  const [showLocalStorage, setShowLocalStorage] = useState<boolean>(false);

  // Dark Mode State
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : false;
  });

  // Apply dark mode to HTML element
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('darkMode', JSON.stringify(true));
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('darkMode', JSON.stringify(false));
    }
  }, [darkMode]);

  const addDefaultTodos = () => {
    const defaultTodos: Todo[] = [
      { id: 101, text: 'Learn React', completed: false, createdAt: new Date() },
      { id: 102, text: 'Build a Todo App', completed: false, createdAt: new Date() },
      { id: 103, text: 'Master TypeScript', completed: false, createdAt: new Date() },
    ];
    setTodos(defaultTodos);
  };

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

  const handleToggleTodo = (id: number) => {
    setTodos(
      todos.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const handleDeleteTodo = (id: number) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      setTodos(todos.filter(todo => todo.id !== id));
    }
  };

  const handleEditTodo = (id: number, newText: string) => {
    setTodos(
      todos.map(todo =>
        todo.id === id ? { ...todo, text: newText } : todo
      )
    );
  };

  const handleClearAll = () => {
    if (window.confirm('⚠️ Delete ALL todos? This cannot be undone!')) {
      clearTodos();
    }
  };

  const handleClearCompleted = () => {
    const completedCount = todos.filter(t => t.completed).length;
    if (completedCount > 0 && window.confirm(`Delete ${completedCount} completed tasks?`)) {
      setTodos(todos.filter(todo => !todo.completed));
    }
  };

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

  const getLocalStorageData = () => {
    const data = localStorage.getItem('todos');
    return data ? JSON.parse(data) : [];
  };

  return (
    <div className={`min-h-screen transition-all duration-300 ${darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50'}`}>
      <div className="max-w-5xl mx-auto py-8 px-4">
        {/* Dark Mode Toggle Button */}
        {/* Dark Mode Toggle Button - FIXED for white text in light mode */}
        <div className="flex justify-end mb-4">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`px-4 py-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 border font-semibold ${darkMode
                ? 'bg-gray-800 text-gray-300 border-gray-700'
                : 'bg-blue-600 text-white border-blue-500'  // ← White text in light mode
              }`}
          >
            {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
          </button>
        </div>

        {/* Main Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden transition-all duration-300">
          {/* Header */}
          <div className={`transition-all duration-300 ${darkMode ? 'bg-gradient-to-r from-gray-700 to-gray-900' : 'bg-gradient-to-r from-blue-600 to-purple-600'} px-6 py-8`}>
            <h1 className="text-3xl md:text-5xl font-bold text-white text-center flex items-center justify-center gap-3">
              <span>📝</span>
              Todo App with Custom Hooks
              <span>⚡</span>
            </h1>
            <p className={`text-center mt-2 text-sm ${darkMode ? 'text-gray-300' : 'text-blue-100'}`}>
              Manage your tasks efficiently!
            </p>
          </div>

          {/* Custom Hooks Badges */}
          <div className={`flex flex-wrap gap-2 p-4 border-b transition-all duration-300 ${darkMode ? 'bg-gray-900 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
            <span className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-300 ${darkMode ? 'bg-gray-700 text-blue-300' : 'bg-blue-100 text-blue-700'}`}>🪝 useLocalStorage</span>
            <span className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-300 ${darkMode ? 'bg-gray-700 text-green-300' : 'bg-green-100 text-green-700'}`}>📡 useFetch</span>
            <span className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-300 ${darkMode ? 'bg-gray-700 text-purple-300' : 'bg-purple-100 text-purple-700'}`}>🕐 useDebounce</span>
            <span className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-300 ${darkMode ? 'bg-gray-700 text-orange-300' : 'bg-orange-100 text-orange-700'}`}>💾 Persists after refresh</span>
          </div>

          <div className="p-6">
            {/* Search Section */}
            <div className="mb-6">
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500">🔍</span>
                <input
                  type="text"
                  className={`w-full pl-10 pr-10 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-200 text-gray-800 placeholder-gray-400'}`}
                  placeholder="Search todos... (typing waits 500ms)"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm && (
                  <button
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
                    onClick={() => setSearchTerm('')}
                  >
                    ✖
                  </button>
                )}
              </div>
              {searchTerm && (
                <div className={`mt-2 text-sm inline-block px-3 py-1 rounded-full transition-all duration-300 ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-blue-50 text-gray-600'}`}>
                  🔍 Found {stats.searchResults} result{stats.searchResults !== 1 ? 's' : ''} for "{searchTerm}"
                </div>
              )}
            </div>

            {/* Add Default Todos Button */}
            {todos.length === 0 && (
              <button
                onClick={addDefaultTodos}
                className={`w-full mb-6 px-4 py-3 border-2 rounded-xl transition-all text-sm font-semibold ${darkMode ? 'bg-gray-700 border-gray-600 text-gray-200 hover:bg-gray-600' : 'bg-gray-100 border-gray-200 text-gray-700 hover:bg-gray-200'}`}
              >
                📋 Add Sample Todos (Learn React, Build Todo App, Master TypeScript)
              </button>
            )}

            {/* API Section */}
            {showApiSection && (
              <div className={`mb-6 rounded-xl p-5 border transition-all duration-300 ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-blue-50 border-blue-200'}`}>
                <div className="flex justify-between items-center mb-4">
                  <h3 className={`font-bold text-lg ${darkMode ? 'text-white' : 'text-gray-800'}`}>📡 Fetch Sample Todos from API</h3>
                  <button
                    onClick={() => setShowApiSection(false)}
                    className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 text-xl"
                  >
                    ✖
                  </button>
                </div>
                <div className="flex gap-3 mb-4">
                  <button
                    onClick={refetchApi}
                    disabled={apiLoading}
                    className="px-5 py-2.5 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-all disabled:opacity-50 text-sm font-semibold"
                  >
                    🔄 {apiLoading ? 'Loading...' : 'Refetch'}
                  </button>
                  <button
                    onClick={handleImportFromAPI}
                    disabled={apiLoading || !apiTodos}
                    className="px-5 py-2.5 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all disabled:opacity-50 text-sm font-semibold"
                  >
                    📥 Import to My Todos
                  </button>
                </div>

                {apiLoading && <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>⏳ Loading todos from API...</p>}
                {apiError && <p className="text-red-500 text-sm">❌ Error: {apiError}</p>}

                {apiTodos && !apiLoading && (
                  <div className="mt-3">
                    <h4 className={`font-semibold mb-2 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>API Preview (Click Import to add)</h4>
                    <ul className="space-y-2 max-h-48 overflow-y-auto">
                      {apiTodos.map(todo => (
                        <li key={todo.id} className={`flex justify-between items-center text-sm rounded-lg p-2 transition-all duration-300 ${darkMode ? 'bg-gray-800 text-gray-300' : 'bg-white text-gray-700'}`}>
                          <span className={darkMode ? 'text-gray-200' : 'text-gray-700'}>{todo.title.length > 50 ? todo.title.substring(0, 50) + '...' : todo.title}</span>
                          <span className={todo.completed ? 'text-green-600 dark:text-green-400 text-xs font-semibold' : 'text-yellow-600 dark:text-yellow-400 text-xs font-semibold'}>
                            {todo.completed ? '✓ Done' : '○ Pending'}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Add Todo Form */}
            <form onSubmit={handleAddTodo} className="flex flex-col sm:flex-row gap-3 mb-6">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="What needs to be done?"
                className={`flex-1 px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-200 text-gray-800 placeholder-gray-400'}`}
              />
              <button
                type="submit"
                className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all font-bold shadow-md"
              >
                + Add Task
              </button>
            </form>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-4 text-white shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-sm">Total Tasks</p>
                    <p className="text-3xl font-bold text-white">{stats.total}</p>
                  </div>
                  <span className="text-4xl">📋</span>
                </div>
              </div>
              <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl p-4 text-white shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-orange-100 text-sm">Active Tasks</p>
                    <p className="text-3xl font-bold text-white">{stats.active}</p>
                  </div>
                  <span className="text-4xl">🔄</span>
                </div>
              </div>
              <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-4 text-white shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100 text-sm">Completed</p>
                    <p className="text-3xl font-bold text-white">{stats.completed}</p>
                  </div>
                  <span className="text-4xl">✅</span>
                </div>
              </div>
            </div>

            {/* Filter Buttons */}
            <div className="flex flex-wrap gap-2 mb-6">
              <button
                onClick={() => setFilter('all')}
                className={`px-5 py-2 rounded-lg font-semibold transition-all ${filter === 'all' ? 'bg-blue-500 text-white shadow-md' : darkMode ? 'bg-gray-700 text-gray-200 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
              >
                All ({stats.total})
              </button>
              <button
                onClick={() => setFilter('active')}
                className={`px-5 py-2 rounded-lg font-semibold transition-all ${filter === 'active' ? 'bg-orange-500 text-white shadow-md' : darkMode ? 'bg-gray-700 text-gray-200 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
              >
                Active ({stats.active})
              </button>
              <button
                onClick={() => setFilter('completed')}
                className={`px-5 py-2 rounded-lg font-semibold transition-all ${filter === 'completed' ? 'bg-green-500 text-white shadow-md' : darkMode ? 'bg-gray-700 text-gray-200 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
              >
                Completed ({stats.completed})
              </button>
            </div>

            {/* Todo List */}
            <div className="mb-6">
              <h4 className={`text-sm font-semibold mb-3 border-b pb-2 transition-all duration-300 ${darkMode ? 'text-gray-400 border-gray-700' : 'text-gray-600 border-gray-200'}`}>
                📋 My Tasks ({filteredTodos.length})
              </h4>
              {filteredTodos.length === 0 ? (
                <p className={`text-center py-8 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  {todos.length === 0
                    ? "✨ No todos! Add a task above or import from API"
                    : searchTerm
                      ? `No tasks match "${searchTerm}"`
                      : "No todos match the selected filter"}
                </p>
              ) : (
                <div className="space-y-3">
                  {filteredTodos.map(todo => (
                    <div
                      key={todo.id}
                      className={`flex items-center gap-3 p-4 rounded-xl transition-all hover:shadow-md ${todo.completed ? 'opacity-60' : ''} ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-50 hover:bg-gray-100'}`}
                    >
                      <input
                        type="checkbox"
                        checked={todo.completed}
                        onChange={() => handleToggleTodo(todo.id)}
                        className="w-5 h-5 cursor-pointer accent-blue-500"
                      />
                      <span className={`flex-1 break-words transition-all duration-300 ${todo.completed ? 'line-through text-gray-500 dark:text-gray-500' : darkMode ? 'text-white' : 'text-gray-800'}`}>
                        {todo.text}
                      </span>
                      {todo.fromAPI && (
                        <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300 rounded text-xs font-semibold">API</span>
                      )}
                      <span className={`text-xs hidden sm:block ${darkMode ? 'text-gray-400' : 'text-gray-400'}`}>{formatDate(todo.createdAt)}</span>
                      <button
                        className="px-2 py-1 text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                        onClick={() => {
                          const newText = prompt('Edit todo:', todo.text);
                          if (newText && newText.trim()) handleEditTodo(todo.id, newText);
                        }}
                      >
                        ✏️
                      </button>
                      <button
                        className="px-2 py-1 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                        onClick={() => handleDeleteTodo(todo.id)}
                      >
                        🗑️
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {todos.length > 0 && (
              <div className={`border-t pt-4 transition-all duration-300 ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mb-4">
                  <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    📊 {stats.active} task{stats.active !== 1 ? 's' : ''} remaining
                    <span className="ml-2 text-xs text-gray-400">💾 Saved in localStorage</span>
                  </div>
                  <div className="flex gap-2">
                    {stats.completed > 0 && (
                      <button
                        onClick={handleClearCompleted}
                        className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-all text-sm font-semibold"
                      >
                        Clear Completed ({stats.completed})
                      </button>
                    )}
                    <button
                      onClick={handleClearAll}
                      className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all text-sm font-semibold"
                    >
                      🗑️ Clear All
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* localStorage Viewer */}
            <div className="mt-6">
              <button
                onClick={() => setShowLocalStorage(!showLocalStorage)}
                className={`w-full px-4 py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${darkMode ? 'bg-gray-700 text-gray-200 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                <span>💾</span>
                {showLocalStorage ? '▼ Hide localStorage Data' : '▶ View localStorage Data'}
                <span>📦</span>
              </button>

              {showLocalStorage && (
                <div className="mt-3 bg-gray-900 rounded-xl p-4 border border-gray-700">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-white font-bold flex items-center gap-2">
                      <span>🗄️</span> localStorage Key: <code className="bg-gray-800 px-2 py-1 rounded text-green-400">'todos'</code>
                    </h4>
                    <button
                      onClick={() => {
                        const data = localStorage.getItem('todos');
                        navigator.clipboard.writeText(data || '[]');
                        alert('✅ localStorage data copied to clipboard!');
                      }}
                      className="px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs transition-all"
                    >
                      📋 Copy All
                    </button>
                  </div>

                  <div className="bg-black rounded-lg p-4 overflow-x-auto max-h-96 overflow-y-auto">
                    <pre className="text-green-400 text-xs font-mono whitespace-pre-wrap break-all">
                      {JSON.stringify(getLocalStorageData(), null, 2)}
                    </pre>
                  </div>

                  <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <div className="bg-gray-800 rounded-lg p-2">
                      <span className="text-gray-400">📊 Total items:</span>
                      <span className="text-white ml-2 font-bold">{getLocalStorageData().length}</span>
                    </div>
                    <div className="bg-gray-800 rounded-lg p-2">
                      <span className="text-gray-400">💾 Storage size:</span>
                      <span className="text-white ml-2 font-bold">
                        ~{Math.ceil(JSON.stringify(getLocalStorageData()).length / 1024)} KB
                      </span>
                    </div>
                  </div>

                  <p className="text-gray-500 text-xs mt-3">
                    💡 Tip: This data persists even after page refresh! Check F12 → Application → Local Storage to verify.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className={`text-center mt-6 text-sm transition-all duration-300 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          <p>✨ Built with React + TypeScript + Tailwind CSS ✨</p>
          <p className="mt-1">🎨 Custom Hooks: useLocalStorage, useFetch, useDebounce</p>
        </div>
      </div>
    </div>
  );
}

export default App;