import { useState } from 'react';
import Modal from './ui/Modal';
import RadioRow from './ui/RadioRow';
import Button from './ui/Button';

const reasons = ['재료 소진', '배달 불가 지역', '기타 (직접 입력)'];

interface RejectModalProps {
  open: boolean;
  onClose: () => void;
  onReject: (reason: string) => void;
}

export default function RejectModal({ open, onClose, onReject }: RejectModalProps) {
  const [selected, setSelected] = useState(reasons[0]);
  const [detail, setDetail] = useState('');

  return (
    <Modal open={open} onClose={onClose} className="w-115 p-6.5 flex flex-col gap-5">
      <div className="text-[21px] font-extrabold text-ink">반려 사유</div>
      <div className="flex flex-col gap-2.25">
        {reasons.map((reason) => {
          const active = reason === selected;
          return (
            <RadioRow
              key={reason}
              variant="inline"
              selected={active}
              onClick={() => setSelected(reason)}
            >
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] text-white flex-none ${
                  active ? 'bg-primary' : 'border-[1.5px] border-outline'
                }`}
              >
                {active && '✓'}
              </div>
              <span
                className={`text-base ${active ? 'font-bold text-ink' : 'font-semibold text-text'}`}
              >
                {reason}
              </span>
            </RadioRow>
          );
        })}
        {selected === '기타 (직접 입력)' && (
          <textarea
            value={detail}
            onChange={(e) => setDetail(e.target.value)}
            maxLength={50}
            placeholder="기타 선택 시 사유를 입력하세요 (최대 50자)"
            className="h-19 border border-border bg-[#FBFAFC] rounded-[11px] px-4 py-3.5 text-sm text-ink placeholder:text-[#A79FB0] outline-none resize-none"
          />
        )}
      </div>
      <div className="flex gap-2.5">
        <Button variant="outline" size="md" className="w-30 flex-none" onClick={onClose}>
          취소
        </Button>
        <div className="flex-1">
          <Button
            variant="primary"
            size="md"
            fullWidth
            onClick={() => onReject(selected === '기타 (직접 입력)' ? detail : selected)}
          >
            반려하기
          </Button>
        </div>
      </div>
    </Modal>
  );
}
