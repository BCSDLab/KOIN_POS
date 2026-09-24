interface LabelValueRowProps {
  label: string;
  children: React.ReactNode;
}

export default function LabelValueRow({ label, children }: LabelValueRowProps) {
  return (
    <div className="flex">
      <div className="w-39.5 flex-none text-[17px] text-text-secondary">{label}</div>
      <div className="text-[18px] text-ink">{children}</div>
    </div>
  );
}
