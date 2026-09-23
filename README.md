# KOIN POS

한국기술교육대학교(코인) 근처 매장 사장님들을 위한 배달 전용 POS 데스크톱 애플리케이션입니다.

## 기술 스택

- Electron + electron-vite
- React + TypeScript
- Tailwind CSS v4
- React Router

## 폴더 구조

```
src/
  main/       # 메인 프로세스 (창 관리, 하드웨어/DB 접근)
  preload/    # 메인 ↔ 렌더러 브릿지
  renderer/   # 실제 화면(React 앱)
    src/
      pages/   # 라우트별 화면
      styles/  # 전역 CSS, 디자인 토큰
      assets/  # 이미지 등 정적 리소스
resources/    # 앱 아이콘 등 런타임 리소스
build/        # 패키징(설치 파일)용 아이콘·설정
```

## 시작하기

### 설치

```bash
pnpm install
```

### 개발 서버 실행

```bash
pnpm dev
```

### 빌드

```bash
pnpm build:win    # Windows
pnpm build:mac    # macOS
pnpm build:linux  # Linux
```

## 권장 개발 환경

[VSCode](https://code.visualstudio.com/) + [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) + [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) + [Tailwind CSS IntelliSense](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss)
