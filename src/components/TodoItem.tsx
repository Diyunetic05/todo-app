import { useState } from 'react';
import { Trash2, CheckCircle, Circle, Edit2, Save, X } from 'lucide-react';

interface Todo {
    id: number;
    text: string;
    completed: boolean;
    createdAt: Date;
}

interface TodoItemProps {
    todo: Todo;
    onToggle: (id: number) => void;
    onDelete: (id: number) => void;
    onEdit: (id: number, newText: string) => void;
}

function TodoItem({ todo, onToggle, onDelete, onEdit }: TodoItemProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [editText, setEditText] = useState(todo.text);

    const handleSaveEdit = () => {
        if (editText.trim() === '') {
            alert('Task cannot be empty!');
            return;
        }
        onEdit(todo.id, editText);
        setIsEditing(false);
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        setEditText(todo.text);
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSaveEdit();
        }
    };

    return (
        <div className={`todo-item ${todo.completed ? 'completed' : ''}`}>
            <button
                onClick={() => onToggle(todo.id)}
                className="toggle-btn"
            >
                {todo.completed ? <CheckCircle size={22} /> : <Circle size={22} />}
            </button>

            {isEditing ? (
                <input
                    type="text"
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="edit-input"
                    autoFocus
                />
            ) : (
                <span className="todo-text">
                    {todo.text}
                </span>
            )}

            <div className="todo-actions">
                {isEditing ? (
                    <>
                        <button onClick={handleSaveEdit} className="save-btn">
                            <Save size={18} />
                        </button>
                        <button onClick={handleCancelEdit} className="cancel-btn">
                            <X size={18} />
                        </button>
                    </>
                ) : (
                    <>
                        <button onClick={() => setIsEditing(true)} className="edit-btn">
                            <Edit2 size={18} />
                        </button>
                        <button onClick={() => onDelete(todo.id)} className="delete-btn">
                            <Trash2 size={18} />
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}

export default TodoItem;