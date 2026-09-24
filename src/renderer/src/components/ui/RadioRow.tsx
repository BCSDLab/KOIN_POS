interface RadioRowProps {
  selected: boolean;
  onClick?: () => void;
  children: React.ReactNode;
  variant?: 'card' | 'inline';
}

export default function RadioRow({ selected, onClick, children, variant = 'card' }: RadioRowProps) {
  const cardVariant = selected
    ? 'bg-white border-2 border-primary px-4.5 py-4 rounded-[13px]'
    : 'bg-white border border-outline px-4.5 py-4 rounded-[13px]';
  const inlineVariant = selected
    ? 'h-14 border-2 border-primary bg-surface px-4 rounded-[11px]'
    : 'h-14 border border-outline px-4 rounded-[11px]';

  return (
    <div
      onClick={onClick}
      className={`flex items-center justify-between gap-2.75 cursor-pointer ${
        variant === 'card' ? cardVariant : inlineVariant
      }`}
    >
      {children}
    </div>
  );
}
