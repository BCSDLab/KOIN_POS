import ApproveModal from './ApproveModal';
import RejectModal from './RejectModal';
import SettingsModal from './SettingsModal';
import EndBusinessModal from './EndBusinessModal';
import ConfirmModal from './ConfirmModal';

export type ModalType = 'Approve' | 'Reject' | 'Setting' | 'EndBusiness' | 'Confirm' | null;

interface DashboardModalsProps {
  activeModal: ModalType;
  onClose: () => void;
  storeName?: string;
  onApproveMinutesSelected: (minutes: number) => void;
  onReject: (reason: string) => void;
  onEndBusiness: () => void;
  confirmMessage: string;
  onConfirm: () => void;
  isConfirmPending: boolean;
}

export default function DashboardModals({
  activeModal,
  onClose,
  storeName,
  onApproveMinutesSelected,
  onReject,
  onEndBusiness,
  confirmMessage,
  onConfirm,
  isConfirmPending
}: DashboardModalsProps) {
  return (
    <>
      <ApproveModal
        open={activeModal === 'Approve'}
        onClose={onClose}
        onConfirm={onApproveMinutesSelected}
      />
      <RejectModal open={activeModal === 'Reject'} onClose={onClose} onReject={onReject} />
      <SettingsModal open={activeModal === 'Setting'} onClose={onClose} storeName={storeName} />
      <EndBusinessModal
        open={activeModal === 'EndBusiness'}
        onClose={onClose}
        onConfirm={onEndBusiness}
      />
      <ConfirmModal
        open={activeModal === 'Confirm'}
        onClose={onClose}
        message={confirmMessage}
        onConfirm={onConfirm}
        isPending={isConfirmPending}
      />
    </>
  );
}
