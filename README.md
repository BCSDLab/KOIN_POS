# KOIN POS

한국기술교육대학교(코인) 근처 매장 사장님들을 위한 배달 전용 POS 데스크톱 애플리케이션입니다.

## 기술 스택

- Electron + electron-vite
- React + TypeScript
- Tailwind CSS v4
- React Router
- TanStack Query — 서버 상태(주문/매장 데이터) 관리, 폴링
- sonner — 토스트 알림
- electron-builder + electron-updater — 패키징, 자동 업데이트

## 폴더 구조

```
src/
  main/       # 메인 프로세스
  preload/    # 메인 ↔ 렌더러 브릿지
  renderer/
    src/
      pages/       # 라우트별 화면
      components/  # 도메인 컴포넌트
        ui/        # 범용 원자 컴포넌트
      apis/        # 도메인별 API 레이어
        apiClient.ts        # 공통 fetch 래퍼, 401 갱신, 에러 타입
          entity.ts    # 타입
          client.ts    # raw fetch 함수
          queries.ts   # useQuery 훅
          mutation.ts  # useMutation 훅
      lib/         # 순수 유틸/도메인 로직
      styles/      # 전역 CSS, 디자인 토큰
      assets/      # 이미지 등 정적 리소스
resources/    # 앱 아이콘 등 런타임 리소스
build/        # 패키징(설치 파일)용 아이콘·설정
```

## 환경 변수

루트에 `.env.development`, `.env.production` 파일 필요 (git에 포함 안 됨)

## 시작하기

### 설치

```bash
pnpm install
```

### 개발 서버 실행

```bash
pnpm dev
```

### 로컬 빌드 (설치 파일만 생성, 배포 아님)

```bash
pnpm build:win    # Windows
pnpm build:mac    # macOS
pnpm build:linux  # Linux
```

## 배포 (GitHub Releases)

`v*` 형태의 태그를 푸시하면 GitHub Actions(`.github/workflows/release.yml`)가 mac/win/linux를 각각 빌드해서 GitHub Releases에 업로드. 기존에 설치된 앱들은 `electron-updater`로 자동 업데이트를 감지.

```bash
# package.json의 version을 올린 뒤
git add package.json && git commit -m "chore: bump version to 1.0.1"
git tag v1.0.1
git push origin main
git push origin v1.0.1
```

Actions 빌드가 끝나면 저장소의 **Releases** 탭에서 Draft 상태인 릴리즈를 **Publish**로 바꿔야 실제 배포.

## 권장 개발 환경

[VSCode](https://code.visualstudio.com/) + [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) + [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) + [Tailwind CSS IntelliSense](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss)
