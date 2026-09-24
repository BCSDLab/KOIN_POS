type BadgeVariant = 'subtle' | 'neutral' | 'solid';
type BadgeSize = 'pill' | 'tag' | 'count' | 'chip';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: BadgeSize;
  dot?: boolean;
}

const variantClass: Record<BadgeVariant, string> = {
  subtle: 'bg-primary-subtle text-primary-ink',
  neutral: 'bg-border text-text-secondary',
  solid: 'bg-primary text-white'
};

const sizeClass: Record<BadgeSize, string> = {
  pill: 'h-7.5 px-3 rounded-[15px] text-[15px]',
  tag: 'h-7 px-3 rounded-[14px] text-[15px]',
  count: 'min-w-6.5 h-6.5 px-2 rounded-full text-sm justify-center',
  chip: 'h-6.5 px-2.5 rounded-[13px] text-[13px]'
};

export default function Badge({
  children,
  variant = 'subtle',
  size = 'tag',
  dot = false
}: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 font-extrabold whitespace-nowrap ${variantClass[variant]} ${sizeClass[size]}`}
    >
      {dot && <span className="w-1.5 h-1.5 rounded-full bg-primary" />}
      {children}
    </span>
  );
}
