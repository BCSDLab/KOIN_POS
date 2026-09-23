interface SectionHeaderProps {
  label: string
  count: number
}

export default function SectionHeader({ label, count }: SectionHeaderProps) {
  return (
    <div className="h-11.5 px-5 bg-[#F7F4FA] border-t border-b border-border flex items-center gap-2.25">
      <span className="text-base font-extrabold text-text-secondary tracking-wide">{label}</span>
      <span className="text-[15px] font-bold text-text-tertiary tabular-nums">{count}건</span>
    </div>
  )
}
