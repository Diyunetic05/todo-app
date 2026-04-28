import { ReactNode } from 'react';

interface ButtonProps {
    onClick: () => void;
    children: ReactNode;
    variant?: 'primary' | 'danger' | 'success' | 'warning' | 'outline';
    size?: 'small' | 'medium' | 'large';
    disabled?: boolean;
    icon?: ReactNode;
    type?: 'button' | 'submit' | 'reset';
}

function Button({
    onClick,
    children,
    variant = 'primary',
    size = 'medium',
    disabled = false,
    icon,
    type = 'button'
}: ButtonProps) {

    const getButtonStyle = (): React.CSSProperties => {
        const style: React.CSSProperties = {
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            borderRadius: '8px',
            cursor: disabled ? 'not-allowed' : 'pointer',
            opacity: disabled ? 0.6 : 1,
            transition: 'all 0.3s ease',
            border: 'none',
            fontWeight: '600',
            fontFamily: 'inherit'
        };

        // Size styles
        if (size === 'small') {
            style.padding = '6px 12px';
            style.fontSize = '13px';
        } else if (size === 'large') {
            style.padding = '12px 24px';
            style.fontSize = '16px';
        } else {
            style.padding = '8px 16px';
            style.fontSize = '14px';
        }

        // Variant styles
        switch (variant) {
            case 'danger':
                style.backgroundColor = '#f44336';
                style.color = 'white';
                break;
            case 'success':
                style.backgroundColor = '#4caf50';
                style.color = 'white';
                break;
            case 'warning':
                style.backgroundColor = '#ff9800';
                style.color = 'white';
                break;
            case 'outline':
                style.backgroundColor = 'transparent';
                style.color = '#667eea';
                style.border = '2px solid #667eea';
                break;
            default:
                style.backgroundColor = '#667eea';
                style.color = 'white';
        }

        return style;
    };

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            style={getButtonStyle()}
        >
            {icon && <span>{icon}</span>}
            {children}
        </button>
    );
}

export default Button;