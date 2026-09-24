import Logo from '../assets/Logo.svg';
import Button from './ui/Button';
import Badge from './ui/Badge';

interface HeaderProps {
  storeName: string;
  onSettings?: () => void;
  onEndBusiness?: () => void;
}

export default function Header({ storeName, onSettings, onEndBusiness }: HeaderProps) {
  return (
    <div className="w-full h-19.5 border-b border-border flex items-center justify-between px-6.5">
      <div className="flex gap-3 items-center">
        <img src={Logo} alt="logo" />
        <p className="text-[22px] font-extrabold text-ink">{storeName}</p>
        <Badge variant="subtle" size="pill">
          영업중
        </Badge>
      </div>
      <div className="flex gap-2.5">
        <Button onClick={onSettings}>설정</Button>
        <Button onClick={onEndBusiness}>영업 종료</Button>
      </div>
    </div>
  );
}
