import Logo from '../assets/Logo.svg';
import Button from './ui/Button';

interface StateCardProps {
  status: 'empty' | 'loading' | 'error';
  message?: string;
  onRetry?: () => void;
}

export default function StateCard({ status, message, onRetry }: StateCardProps) {
  if (status === 'loading') {
    return (
      <div className="w-full h-full flex flex-col">
        {[0, 1, 2, 3, 4].map((i) => (
          <div key={i} className="h-25.5 border-b border-[#F4F0F7] px-4.25 flex items-center">
            <div className="w-full h-14 rounded-xl bg-[#F5EEFA] animate-pulse" />
          </div>
        ))}
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center gap-3.5 px-10 text-center">
        <div className="w-14.5 h-14.5 rounded-full bg-primary-subtle text-primary-ink text-2xl font-extrabold flex items-center justify-center">
          !
        </div>
        <div className="text-lg font-bold text-ink">주문을 불러오지 못했습니다</div>
        <div className="text-sm text-text-tertiary leading-relaxed">
          {message ?? '오류가 발생했습니다.'}
        </div>
        <Button variant="primary" size="sm" onClick={onRetry}>
          다시 시도
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-3.5 px-10 text-center">
      <div className="size-20 rounded-full bg-[#F7EDFD] flex items-center justify-center">
        <img src={Logo} alt="" className="w-15 h-13" />
      </div>
      <div className="text-lg font-bold text-ink">대기 중인 주문이 없습니다</div>
      <div className="text-sm text-text-tertiary leading-relaxed">
        새 주문이 들어오면 소리와 함께
        <br />이 목록에 바로 나타납니다.
      </div>
    </div>
  );
}
