import { useState } from 'react';
import Modal from './ui/Modal';
import Button from './ui/Button';

const presets = [10, 15, 20, 25, 30, 40, 45, 60];

interface ApproveModalProps {
  open: boolean;
  onClose: () => void;
  onApprove: (minutes: number) => void;
}

export default function ApproveModal({ open, onClose, onApprove }: ApproveModalProps) {
  const [minutes, setMinutes] = useState(20);

  return (
    <Modal open={open} onClose={onClose} className="w-115 p-6.5 flex flex-col gap-5">
      <div className="text-[21px] font-extrabold text-ink">예상 도착 시간</div>
      <div className="grid grid-cols-4 gap-2.25">
        {presets.map((m) => {
          const active = m === minutes;
          return (
            <button
              key={m}
              onClick={() => setMinutes(m)}
              className={`h-14 rounded-[11px] flex items-center justify-center text-base ${
                active
                  ? 'border-2 border-primary bg-surface font-extrabold text-primary-ink'
                  : 'border border-outline font-bold text-text'
              }`}
            >
              {m}분
            </button>
          );
        })}
      </div>
      <div className="bg-surface border border-primary-subtle rounded-[11px] px-4 py-3.5 flex items-center justify-between">
        <span className="text-sm text-text-secondary font-semibold">고객 안내 도착 예정</span>
        <span className="text-lg font-extrabold text-primary-ink tabular-nums">{minutes}분 후</span>
      </div>
      <div className="flex gap-2.5">
        <Button variant="outline" size="md" className="w-30 flex-none" onClick={onClose}>
          취소
        </Button>
        <div className="flex-1">
          <Button variant="primary" size="md" fullWidth onClick={() => onApprove(minutes)}>
            승인하기
          </Button>
        </div>
      </div>
    </Modal>
  );
}
