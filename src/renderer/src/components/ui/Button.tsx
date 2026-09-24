import { ButtonHTMLAttributes } from 'react';

type ButtonVariant = 'primary' | 'outline';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
}

const variantClass: Record<ButtonVariant, string> = {
  primary: 'bg-primary text-white shadow-[0_8px_20px_rgba(182,17,245,0.28)]',
  outline: 'bg-white border border-outline text-text'
};

const sizeClass: Record<ButtonSize, string> = {
  sm: 'h-11.5 px-4.5 text-[17px] rounded-[10px] font-bold',
  md: 'h-13.5 px-5 text-[17px] rounded-xl font-bold',
  lg: 'h-17 px-5 text-[21px] rounded-[13px] font-extrabold'
};

export default function Button({
  variant = 'outline',
  size = 'sm',
  fullWidth = false,
  className = '',
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      className={`flex items-center justify-center gap-2 ${variantClass[variant]} ${sizeClass[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}
