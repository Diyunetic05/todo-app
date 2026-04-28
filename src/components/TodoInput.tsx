import { useState } from 'react';
import { Plus } from 'lucide-react';
import Button from './Button';

interface TodoInputProps {
    onAddTodo: (text: string) => void;
}

function TodoInput({ onAddTodo }: TodoInputProps) {
    const [inputValue, setInputValue] = useState('');

    const handleAdd = () => {
        if (inputValue.trim() === '') {
            alert('Please enter a task!');
            return;
        }
        onAddTodo(inputValue);
        setInputValue('');
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleAdd();
        }
    };

    return (
        <div className="input-section">
            <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="What needs to be done?"
                className="todo-input"
            />
            <Button onClick={handleAdd} variant="primary" size="medium" icon={<Plus size={18} />}>
                Add Task
            </Button>
        </div>
    );
}

export default TodoInput;