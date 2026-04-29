import React from 'react';

interface ButtonProps {
    onClick: () => void;
    children: React.ReactNode;
    variant?: 'primary' | 'danger' | 'secondary';
    size?: 'small' | 'medium' | 'large';
}

const Button: React.FC<ButtonProps> = ({
    onClick,
    children,
    variant = 'primary',
    size = 'medium'
}) => {
    const variants = {
        primary: '#667eea',
        danger: '#dc3545',
        secondary: '#6c757d'
    };

    const sizes = {
        small: { padding: '4px 12px', fontSize: '12px' },
        medium: { padding: '8px 16px', fontSize: '14px' },
        large: { padding: '12px 24px', fontSize: '16px' }
    };

    return (
        <button
            onClick={onClick}
            style={{
                background: variants[variant],
                ...sizes[size],
                border: 'none',
                borderRadius: '8px',
                color: 'white',
                cursor: 'pointer',
                transition: 'all 0.3s'
            }}
        >
            {children}
        </button>
    );
};

export default Button;