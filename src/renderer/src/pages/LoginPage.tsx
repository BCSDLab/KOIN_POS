import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Logo from '../assets/Logo.svg'
import TextInput from '../components/ui/TextInput'
import Checkbox from '../components/ui/Checkbox'
import Button from '../components/ui/Button'

export default function LoginPage() {
  const navigate = useNavigate()
  const [phoneNumber, setPhoneNumber] = useState('01032898790')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [keepSignedIn, setKeepSignedIn] = useState(true)

  const handleSubmit = (): void => {
    navigate('/stores')
  }

  return (
    <div className="w-full h-screen flex items-center justify-center bg-[#FBFAFC]">
      <div className="w-95 flex flex-col gap-5.5">
        <div className="flex flex-col gap-2.5 items-center text-center">
          <img src={Logo} alt="logo" className="w-14.5" />
          <div className="text-[26px] font-extrabold text-ink">코인 POS</div>
        </div>
        <div className="flex flex-col gap-3">
          <TextInput
            type="text"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="이메일"
          />
          <TextInput
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="비밀번호"
            rightSlot={
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="text-sm font-bold text-primary-ink flex-none"
              >
                {showPassword ? '숨기기' : '보기'}
              </button>
            }
          />
          <Checkbox checked={keepSignedIn} onChange={setKeepSignedIn} label="로그인 상태 유지" />
        </div>
        <Button variant="primary" size="md" fullWidth onClick={handleSubmit}>
          로그인
        </Button>
      </div>
    </div>
  )
}
