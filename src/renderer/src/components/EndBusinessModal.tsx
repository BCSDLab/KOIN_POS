import Logo from '../assets/Logo.svg'
import Modal from './ui/Modal'
import Button from './ui/Button'

interface EndBusinessModalProps {
  open: boolean
  onClose: () => void
  onConfirm: () => void
}

export default function EndBusinessModal({ open, onClose, onConfirm }: EndBusinessModalProps) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      className="w-110 px-7 pt-8 pb-6.5 flex flex-col gap-5.5 items-center text-center"
    >
      <img src={Logo} alt="" className="w-22 -mb-3" />
      <div className="flex flex-col gap-2.5">
        <div className="text-2xl font-extrabold text-ink">영업을 종료하시겠습니까?</div>
        <div className="text-lg text-text-secondary leading-relaxed">
          종료하면 새 주문을 받지 않고
          <br />
          매장 선택 화면으로 이동합니다.
        </div>
      </div>
      <div className="flex gap-2.5 w-full">
        <Button variant="outline" size="md" className="w-32.5 flex-none" onClick={onClose}>
          취소
        </Button>
        <div className="flex-1">
          <Button variant="primary" size="md" fullWidth onClick={onConfirm}>
            확인
          </Button>
        </div>
      </div>
    </Modal>
  )
}
