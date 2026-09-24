import Logo from '../assets/Logo.svg';
import Button from './ui/Button';

interface StateCardProps {
  status: 'empty' | 'loading' | 'error';
  onRetry?: () => void;
}

const shell =
  'w-95 h-85 bg-white border border-border rounded-2xl shadow-[0_20px_50px_rgba(70,20,100,0.1)]';

export default function StateCard({ status, onRetry }: StateCardProps) {
  if (status === 'loading') {
    return (
      <div className={`${shell} flex flex-col p-5.5 gap-3.5`}>
        <div className="text-[13px] font-extrabold text-primary-ink">불러오는 중</div>
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-17.5 rounded-xl bg-[#F5EEFA] animate-pulse" />
        ))}
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div
        className={`${shell} flex flex-col items-center justify-center gap-3.5 px-10 text-center`}
      >
        <div className="w-14.5 h-14.5 rounded-full bg-primary-subtle text-primary-ink text-2xl font-extrabold flex items-center justify-center">
          !
        </div>
        <div className="text-lg font-bold text-ink">주문을 불러오지 못했습니다</div>
        <div className="text-sm text-text-tertiary leading-relaxed">
          네트워크 연결을 확인해 주세요.
          <br />
          연결되면 자동으로 다시 시도합니다.
        </div>
        <Button variant="primary" size="sm" onClick={onRetry}>
          다시 시도
        </Button>
      </div>
    );
  }

  return (
    <div className={`${shell} flex flex-col items-center justify-center gap-3.5 px-10 text-center`}>
      <div className="w-14.5 h-14.5 rounded-full bg-[#F7EDFD] flex items-center justify-center">
        <img src={Logo} alt="" className="w-8.5" />
      </div>
      <div className="text-lg font-bold text-ink">대기 중인 주문이 없습니다</div>
      <div className="text-sm text-text-tertiary leading-relaxed">
        새 주문이 들어오면 소리와 함께
        <br />이 목록에 바로 나타납니다.
      </div>
    </div>
  );
}
