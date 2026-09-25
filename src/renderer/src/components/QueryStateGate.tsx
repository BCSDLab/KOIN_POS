import type { ReactNode } from 'react';
import StateCard from './StateCard';

interface QueryStateGateProps {
  isPending: boolean;
  isError: boolean;
  isOffline: boolean;
  length: number;
  errorMessage?: string;
  onRetry: () => void;
  children: ReactNode;
}

export default function QueryStateGate({
  isPending,
  isError,
  isOffline,
  length,
  errorMessage,
  onRetry,
  children
}: QueryStateGateProps) {
  if (isOffline && isPending) {
    return (
      <div className="h-full">
        <StateCard
          status="error"
          message="오프라인 상태입니다. 연결을 확인해주세요."
          onRetry={onRetry}
        />
      </div>
    );
  }

  if (isPending) {
    return (
      <div className="h-full">
        <StateCard status="loading" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="h-full">
        <StateCard status="error" message={errorMessage} onRetry={onRetry} />
      </div>
    );
  }

  if (length === 0) {
    return (
      <div className="h-full">
        <StateCard status="empty" />
      </div>
    );
  }

  return <>{children}</>;
}
