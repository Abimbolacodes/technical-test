import { ButtonHTMLAttributes } from 'react';

type Props = {
  variant?: 'primary' | 'secondary' | 'danger' | "ghost";
  children: React.ReactNode;
  className?: string;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export function Button({ variant = 'primary', children, className = '', ...rest }: Props) {
  const base = 'px-4 py-2 rounded text-white';
  
  const variants: Record<string, string> = {
    primary: 'bg-blue-600 hover:bg-blue-700',
    secondary: 'bg-gray-500 hover:bg-gray-600',
    danger: 'bg-red-600 hover:bg-red-700',
    ghost: 'bg-transparent border border-gray-300 text-gray-700 hover:bg-gray-100'

  };

  const finalClassName = `${base} ${variants[variant] || ''} ${className}`;

  return (
    <button className={finalClassName} {...rest}>
      {children}
    </button>
  );
}
