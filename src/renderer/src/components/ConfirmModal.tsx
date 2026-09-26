import Modal from './ui/Modal';
import Button from './ui/Button';

interface ConfirmModalProps {
  open: boolean;
  onClose: () => void;
  message: string;
  onConfirm: () => void;
  isPending?: boolean;
}

export default function ConfirmModal({
  open,
  onClose,
  message,
  onConfirm,
  isPending = false
}: ConfirmModalProps) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      className="w-110 px-7 pt-8 pb-6.5 flex flex-col gap-5.5 items-center text-center"
    >
      <div className="text-2xl font-extrabold text-ink">{message}</div>
      <div className="flex gap-2.5 w-full">
        <Button
          variant="outline"
          size="md"
          className="w-32.5 flex-none"
          onClick={onClose}
          disabled={isPending}
        >
          취소
        </Button>
        <div className="flex-1">
          <Button variant="primary" size="md" fullWidth onClick={onConfirm} disabled={isPending}>
            {isPending ? '처리 중...' : '확인'}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
