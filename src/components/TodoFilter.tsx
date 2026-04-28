import Button from './Button';

interface TodoFilterProps {
    filter: 'all' | 'active' | 'completed';
    onFilterChange: (filter: 'all' | 'active' | 'completed') => void;
    stats: { total: number; active: number; completed: number };
}

function TodoFilter({ filter, onFilterChange, stats }: TodoFilterProps) {
    return (
        <div className="filter-section">
            <Button
                onClick={() => onFilterChange('all')}
                variant={filter === 'all' ? 'primary' : 'outline'}
                size="medium"
            >
                All ({stats.total})
            </Button>
            <Button
                onClick={() => onFilterChange('active')}
                variant={filter === 'active' ? 'warning' : 'outline'}
                size="medium"
            >
                Active ({stats.active})
            </Button>
            <Button
                onClick={() => onFilterChange('completed')}
                variant={filter === 'completed' ? 'success' : 'outline'}
                size="medium"
            >
                Completed ({stats.completed})
            </Button>
        </div>
    );
}

export default TodoFilter;