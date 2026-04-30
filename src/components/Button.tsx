import React from 'react';

interface ButtonProps {
    onClick: () => void;
    children: React.ReactNode;
    variant?: 'primary' | 'danger' | 'secondary' | 'outline' | 'warning' | 'success';
    size?: 'small' | 'medium' | 'large';
}

const Button: React.FC<ButtonProps> = ({
    onClick,
    children,
    variant = 'primary',
    size = 'medium'
}) => {
    const variants = {
        primary: { background: '#4a90e2', color: 'white', border: 'none' },
        danger: { background: '#dc3545', color: 'white', border: 'none' },
        secondary: { background: '#6c757d', color: 'white', border: 'none' },
        outline: { background: 'white', color: '#4a90e2', border: '1px solid #4a90e2' },
        warning: { background: '#ffc107', color: '#333', border: 'none' },
        success: { background: '#28a745', color: 'white', border: 'none' }
    };

    const sizes = {
        small: { padding: '4px 12px', fontSize: '12px' },
        medium: { padding: '8px 16px', fontSize: '14px' },
        large: { padding: '12px 24px', fontSize: '16px' }
    };

    const variantStyle = variants[variant];
    const sizeStyle = sizes[size];

    return (
        <button
            onClick={onClick}
            style={{
                ...variantStyle,
                ...sizeStyle,
                borderRadius: '6px',
                cursor: 'pointer',
                transition: 'all 0.2s',
                fontWeight: '500'
            }}
        >
            {children}
        </button>
    );
};

export default Button;