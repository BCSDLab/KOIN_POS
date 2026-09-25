import React from 'react';
import Logo from '../assets/Logo.svg';
import Button from './ui/Button';
interface Props {
  children: React.ReactNode;
}
export class ErrorBoundary extends React.Component<Props> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="w-full h-screen flex items-center justify-center">
          <div className="flex flex-col gap-2">
            <img src={Logo} className="w-60.75 h-30" />
            <p className="font-semibold text-center">
              문제가 발생했어요.
              <br />
              아래 버튼을 눌러 새로고침 해주세요
            </p>
            <Button variant="primary" onClick={() => window.location.reload()}>
              새로고침하기
            </Button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
