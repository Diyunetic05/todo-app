interface TodoFilterProps {
    filter: 'all' | 'active' | 'completed';
    onFilterChange: (filter: 'all' | 'active' | 'completed') => void;
    stats: { total: number; active: number; completed: number };
}

function TodoFilter({ filter, onFilterChange, stats }: TodoFilterProps) {
    return (
        <div className="filter-section">
            <button
                onClick={() => onFilterChange('all')}
                className={`filter-btn ${filter === 'all' ? 'active-all' : ''}`}
            >
                All ({stats.total})
            </button>
            <button
                onClick={() => onFilterChange('active')}
                className={`filter-btn ${filter === 'active' ? 'active-active' : ''}`}
            >
                Active ({stats.active})
            </button>
            <button
                onClick={() => onFilterChange('completed')}
                className={`filter-btn ${filter === 'completed' ? 'active-completed' : ''}`}
            >
                Completed ({stats.completed})
            </button>
        </div>
    );
}

export default TodoFilter;