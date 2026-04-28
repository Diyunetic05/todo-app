import { useState } from 'react';
import { Trash2, CheckCircle, Circle, Edit2, Save, X } from 'lucide-react';
import Button from './Button';

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
            {/* Toggle button - special case, not using Button component */}
            <button onClick={() => onToggle(todo.id)} className="toggle-btn">
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
                <span className="todo-text">{todo.text}</span>
            )}

            <div className="todo-actions">
                {isEditing ? (
                    <>
                        {/* Save Button - works as SAVE */}
                        <Button
                            onClick={handleSaveEdit}
                            variant="success"
                            size="small"
                            icon={<Save size={16} />}
                        >
                            Save
                        </Button>

                        {/* Cancel Button - works as CANCEL */}
                        <Button
                            onClick={handleCancelEdit}
                            variant="outline"
                            size="small"
                            icon={<X size={16} />}
                        >
                            Cancel
                        </Button>
                    </>
                ) : (
                    <>
                        {/* Edit Button - works as EDIT */}
                        <Button
                            onClick={() => setIsEditing(true)}
                            variant="warning"
                            size="small"
                            icon={<Edit2 size={16} />}
                        >
                            Edit
                        </Button>

                        {/* Delete Button - works as DELETE */}
                        <Button
                            onClick={() => onDelete(todo.id)}
                            variant="danger"
                            size="small"
                            icon={<Trash2 size={16} />}
                        >
                            Delete
                        </Button>
                    </>
                )}
            </div>
        </div>
    );
}

export default TodoItem;