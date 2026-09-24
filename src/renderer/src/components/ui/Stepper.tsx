interface StepperProps {
  value: number;
  onChange?: (value: number) => void;
  min?: number;
}

export default function Stepper({ value, onChange, min = 1 }: StepperProps) {
  return (
    <div className="flex items-center gap-3.5">
      <button
        type="button"
        onClick={() => onChange?.(Math.max(min, value - 1))}
        className="w-9 h-9 border border-outline rounded-[9px] flex items-center justify-center text-lg text-text"
      >
        −
      </button>
      <span className="text-[17px] font-bold text-ink">{value}</span>
      <button
        type="button"
        onClick={() => onChange?.(value + 1)}
        className="w-9 h-9 border border-outline rounded-[9px] flex items-center justify-center text-lg text-text"
      >
        +
      </button>
    </div>
  );
}
