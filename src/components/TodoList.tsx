import TodoItem from './TodoItem';

interface Todo {
    id: number;
    text: string;
    completed: boolean;
    createdAt: Date;
}

interface TodoListProps {
    todos: Todo[];
    filter: 'all' | 'active' | 'completed';
    onToggle: (id: number) => void;
    onDelete: (id: number) => void;
    onEdit: (id: number, newText: string) => void;
}

function TodoList({ todos, filter, onToggle, onDelete, onEdit }: TodoListProps) {
    const getFilteredTodos = () => {
        switch (filter) {
            case 'active':
                return todos.filter(todo => !todo.completed);
            case 'completed':
                return todos.filter(todo => todo.completed);
            default:
                return todos;
        }
    };

    const filteredTodos = getFilteredTodos();

    if (filteredTodos.length === 0) {
        return (
            <div className="empty-state">
                {filter === 'all' && '✨ No tasks yet! Add one above ✨'}
                {filter === 'active' && '🎉 All tasks completed! Great job! 🎉'}
                {filter === 'completed' && '📝 No completed tasks yet'}
            </div>
        );
    }

    return (
        <div className="todo-list">
            {filteredTodos.map(todo => (
                <TodoItem
                    key={todo.id}
                    todo={todo}
                    onToggle={onToggle}
                    onDelete={onDelete}
                    onEdit={onEdit}
                />
            ))}
        </div>
    );
}

export default TodoList;  // ← MAKE SURE THIS LINE EXISTS!