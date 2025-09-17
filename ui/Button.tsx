import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'outline' | 'destructive';
}

const Button: React.FC<ButtonProps> = ({ children, className, variant, ...props }) => {
  let variantClass = '';
  if (variant === 'outline') {
    variantClass = 'bg-transparent border border-blue-600 text-blue-600 hover:bg-blue-50';
  } else if (variant === 'destructive') {
    variantClass = 'bg-red-600 text-white hover:bg-red-700';
  } else {
    variantClass = 'bg-blue-600 text-white hover:bg-blue-700';
  }
  return (
    <button className={`px-4 py-2 rounded-lg ${variantClass} ${className ?? ''}`} {...props}>
      {children}
    </button>
  );
};

export default Button;
export { Button };
