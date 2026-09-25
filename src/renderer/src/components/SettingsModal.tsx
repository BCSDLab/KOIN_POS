import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from './ui/Modal';
import Toggle from './ui/Toggle';
import Stepper from './ui/Stepper';
import Button from './ui/Button';

interface SettingsModalProps {
  open: boolean;
  onClose: () => void;
  storeName: string | undefined;
}

export default function SettingsModal({
  open,
  onClose,
  storeName = '코인 사장님'
}: SettingsModalProps) {
  const navigate = useNavigate();
  const [autoPrint, setAutoPrint] = useState(true);
  const [printCount, setPrintCount] = useState(1);
  const [soundAlert, setSoundAlert] = useState(true);

  return (
    <Modal open={open} onClose={onClose} className="w-150 flex flex-col">
      <div className="h-15 border-b border-border flex items-center px-6 text-[19px] font-extrabold text-ink flex-none">
        설정
      </div>
      <div className="px-6 py-5.5 flex flex-col gap-6">
        <div className="flex flex-col gap-3.5">
          <div className="text-[15px] font-extrabold text-primary-ink">프린터</div>
          <div className="flex items-center justify-between border border-border rounded-xl px-4.5 py-4">
            <div>
              <div className="text-base font-bold text-ink">EPSON TM-T88</div>
              <div className="text-[13px] text-text-tertiary mt-1">USB 연결됨</div>
            </div>
            <Button variant="outline" size="sm" className="h-10 px-4 text-sm">
              테스트 출력
            </Button>
          </div>
          <div className="flex items-center justify-between border border-border rounded-xl px-4.5 py-4">
            <div>
              <div className="text-base font-bold text-ink">승인 시 주문서 자동 출력</div>
              <div className="text-[13px] text-text-tertiary mt-1">
                끄면 상세 화면에서 수동으로 출력합니다
              </div>
            </div>
            <Toggle checked={autoPrint} onChange={setAutoPrint} />
          </div>
          <div className="flex items-center justify-between border border-border rounded-xl px-4.5 py-4">
            <div className="text-base font-bold text-ink">출력 매수</div>
            <Stepper value={printCount} onChange={setPrintCount} />
          </div>
        </div>
        <div className="flex flex-col gap-3.5">
          <div className="text-[15px] font-extrabold text-primary-ink">신규 주문 알림</div>
          <div className="flex items-center justify-between border border-border rounded-xl px-4.5 py-4">
            <div>
              <div className="text-base font-bold text-ink">알림음</div>
              <div className="text-[13px] text-text-tertiary mt-1">
                종소리, 주문 수락 전까지 15초마다 반복
              </div>
            </div>
            <Toggle checked={soundAlert} onChange={setSoundAlert} />
          </div>
        </div>
        <div className="flex flex-col gap-3.5">
          <div className="text-[15px] font-extrabold text-primary-ink">매장</div>
          <div className="flex items-center justify-between border border-border rounded-xl px-4.5 py-4">
            <div>
              <div className="text-base font-bold text-ink">{storeName}</div>
              <div className="text-[13px] text-text-tertiary mt-1">
                다른 매장으로 전환하려면 매장 선택으로 이동하세요
              </div>
            </div>
            <button
              type="button"
              onClick={() => navigate('/stores')}
              className="h-10 px-4 border-[1.5px] border-primary rounded-[10px] text-sm font-extrabold text-primary-ink whitespace-nowrap"
            >
              매장 선택
            </button>
          </div>
        </div>
      </div>
      <div className="px-6 pb-5.5 flex justify-end">
        <Button variant="primary" size="md" className="px-7" onClick={onClose}>
          확인
        </Button>
      </div>
    </Modal>
  );
}
