import Badge from './ui/Badge';

interface OrderListItemProps {
  no: string;
  type: '배달' | '포장';
  sub: string;
  selected: boolean;
  onClick?: () => void;
}

export default function OrderListItem({ no, type, sub, selected, onClick }: OrderListItemProps) {
  return (
    <div
      onClick={onClick}
      className={`h-25.5 pl-4.25 pr-5 border-b border-[#F4F0F7] flex items-center gap-3.25 cursor-pointer ${
        selected ? 'bg-surface' : 'bg-white'
      }`}
    >
      <div
        className={`w-0.75 h-10 rounded-sm flex-none ${selected ? 'bg-primary' : 'bg-transparent'}`}
      />
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center gap-2.25">
          <span className="text-[23px] font-extrabold text-ink tabular-nums">{no}</span>
          <Badge variant={type === '배달' ? 'subtle' : 'neutral'}>{type}</Badge>
        </div>
        <div className="text-base text-text-secondary font-semibold">{sub}</div>
      </div>
    </div>
  );
}
