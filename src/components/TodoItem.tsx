import React from 'react';

interface Todo {
    id: number;
    text: string;
    completed: boolean;
    createdAt: Date;
    fromAPI?: boolean;
}

interface TodoItemProps {
    todo: Todo;  // ← Make sure todo has type Todo
    onToggle: (id: number) => void;
    onDelete: (id: number) => void;
    onEdit: (id: number, newText: string) => void;
}

function TodoItem({ todo, onToggle, onDelete, onEdit }: TodoItemProps) {
    const formatDate = (date: Date) => {
        const d = new Date(date);
        return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
    };

    return (
        <div className={`todo-item ${todo.completed ? 'completed' : ''}`}>
            <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => onToggle(todo.id)}
            />
            <span className="todo-text">{todo.text}</span>
            {todo.fromAPI && <span className="api-badge">API</span>}
            <span className="todo-date">{formatDate(todo.createdAt)}</span>
            <button
                className="edit-btn"
                onClick={() => {
                    const newText = prompt('Edit todo:', todo.text);
                    if (newText && newText.trim()) onEdit(todo.id, newText);
                }}
            >
                ✏️
            </button>
            <button className="delete-btn" onClick={() => onDelete(todo.id)}>
                🗑️
            </button>
        </div>
    );
}

export default TodoItem;