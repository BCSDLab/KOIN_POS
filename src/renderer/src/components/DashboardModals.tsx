import ApproveModal from './ApproveModal';
import RejectModal from './RejectModal';
import SettingsModal from './SettingsModal';
import EndBusinessModal from './EndBusinessModal';

export type ModalType = 'Approve' | 'Reject' | 'Setting' | 'EndBusiness' | null;

interface DashboardModalsProps {
  activeModal: ModalType;
  onClose: () => void;
  storeName?: string;
  onApprove: (minutes: number) => void;
  onReject: (reason: string) => void;
  onEndBusiness: () => void;
}

export default function DashboardModals({
  activeModal,
  onClose,
  storeName,
  onApprove,
  onReject,
  onEndBusiness
}: DashboardModalsProps) {
  return (
    <>
      <ApproveModal open={activeModal === 'Approve'} onClose={onClose} onApprove={onApprove} />
      <RejectModal open={activeModal === 'Reject'} onClose={onClose} onReject={onReject} />
      <SettingsModal open={activeModal === 'Setting'} onClose={onClose} storeName={storeName} />
      <EndBusinessModal
        open={activeModal === 'EndBusiness'}
        onClose={onClose}
        onConfirm={onEndBusiness}
      />
    </>
  );
}
