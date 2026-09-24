interface ToggleProps {
  checked: boolean;
  onChange?: (checked: boolean) => void;
}

export default function Toggle({ checked, onChange }: ToggleProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange?.(!checked)}
      className={`w-13 h-7.5 rounded-full flex items-center px-0.75 transition-colors ${
        checked ? 'bg-primary justify-end' : 'bg-border justify-start'
      }`}
    >
      <span className="w-6 h-6 rounded-full bg-white" />
    </button>
  );
}
