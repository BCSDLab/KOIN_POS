interface CheckboxProps {
  checked: boolean;
  onChange?: (checked: boolean) => void;
  label?: string;
}

export default function Checkbox({ checked, onChange, label }: CheckboxProps) {
  return (
    <label
      className="flex items-center gap-2.25 cursor-pointer select-none"
      onClick={() => onChange?.(!checked)}
    >
      <span
        className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] text-white ${
          checked ? 'bg-primary' : 'border border-outline'
        }`}
      >
        {checked && '✓'}
      </span>
      {label && <span className="text-sm text-text">{label}</span>}
    </label>
  );
}
