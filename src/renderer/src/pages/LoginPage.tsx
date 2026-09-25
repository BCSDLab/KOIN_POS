import { useState } from 'react';
import Logo from '../assets/Logo.svg';
import TextInput from '../components/ui/TextInput';
import Button from '../components/ui/Button';
import { usePostOwnerLogin } from '@renderer/apis/login/mutation';
import { useNavigate } from 'react-router-dom';
import { sha256 } from '@bcsdlab/utils';

export default function LoginPage() {
  const [account, setAccount] = useState('01032898790');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const navigate = useNavigate();
  const loginMutation = usePostOwnerLogin();
  const handleSubmit = async (): Promise<void> => {
    const hashedPassword = await sha256(password);
    loginMutation.mutate(
      { account, password: hashedPassword },
      {
        onSuccess: () => {
          navigate('/stores');
        },
        onError: (error) => {
          console.log(error);
          setMessage(error.message);
        }
      }
    );
  };

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
            value={account}
            onChange={(e) => setAccount(e.target.value)}
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
        </div>
        <div className="flex flex-col gap-1">
          <Button variant="primary" size="md" fullWidth onClick={handleSubmit}>
            로그인
          </Button>
          {message !== null && <p className="text-red-600 text-[10px] mt-1">{message}</p>}
        </div>
      </div>
    </div>
  );
}
