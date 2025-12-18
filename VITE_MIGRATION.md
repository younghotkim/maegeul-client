# Vite 마이그레이션 완료 가이드

## 변경 사항 요약

Create React App에서 Vite로 성공적으로 마이그레이션되었습니다.

### 주요 변경 사항

1. **빌드 도구**: `react-scripts` → `vite`
2. **환경 변수**: `REACT_APP_*` → `VITE_*`
3. **환경 변수 접근**: `process.env.*` → `import.meta.env.*`
4. **프로덕션 모드 체크**: `process.env.NODE_ENV` → `import.meta.env.MODE`
5. **index.html**: 루트 디렉토리로 이동 및 Vite 형식으로 변경

## 설치 및 실행

### 1. 의존성 설치

```bash
cd client
npm install
```

### 2. 개발 서버 실행

```bash
npm run dev
# 또는
npm start
```

개발 서버는 기본적으로 `http://localhost:3000`에서 실행됩니다.

### 3. 프로덕션 빌드

```bash
npm run build
```

빌드된 파일은 `build` 디렉토리에 생성됩니다.

### 4. 프로덕션 미리보기

```bash
npm run preview
```

## 환경 변수 설정

### 로컬 개발

`.env` 파일을 생성하고 다음 변수를 설정하세요:

```bash
VITE_API_URL=http://localhost:5001/api
VITE_BASE_URL=http://localhost:3000
```

### 프로덕션 (Vercel)

Vercel 대시보드에서 다음 환경 변수를 설정하세요:

```bash
VITE_API_URL=https://maegeul-api.onrender.com/api
VITE_BASE_URL=https://your-project-name.vercel.app
```

## Vercel 배포 설정

Vercel 대시보드에서 다음 설정을 확인하세요:

- **Framework Preset**: `Vite`
- **Root Directory**: `client`
- **Build Command**: `npm run build`
- **Output Directory**: `build`

## 주요 파일 변경

### 새로 생성된 파일

- `vite.config.ts` - Vite 설정 파일
- `index.html` - 루트 디렉토리로 이동 (Vite 형식)
- `tsconfig.node.json` - Node.js용 TypeScript 설정
- `vite-env.d.ts` - Vite 환경 변수 타입 정의

### 수정된 파일

- `package.json` - 스크립트 및 의존성 업데이트
- `tsconfig.json` - Vite 호환 설정으로 업데이트
- 모든 소스 파일 - 환경 변수 접근 방식 변경

### 삭제된 파일

- `src/react-app-env.d.ts` - 더 이상 필요 없음

## 문제 해결

### 빌드 오류

1. **의존성 재설치**:

   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

2. **TypeScript 오류**:
   ```bash
   npm run build
   ```
   TypeScript 타입 체크가 빌드 전에 실행됩니다.

### 환경 변수가 적용되지 않는 경우

1. 환경 변수 이름이 `VITE_`로 시작하는지 확인
2. Vercel에서 환경 변수 변경 후 재배포 필요
3. 브라우저 캐시 클리어

### 개발 서버가 시작되지 않는 경우

```bash
# 포트가 사용 중인 경우
npm run dev -- --port 3001
```

## 성능 개선

Vite 마이그레이션으로 다음 개선 사항을 기대할 수 있습니다:

- ⚡ **빌드 속도**: 2-5분 → 10-30초
- 🚀 **개발 서버 시작**: 10-30초 → 1-3초
- 🔥 **HMR 속도**: 즉각적인 업데이트
- 📦 **번들 크기**: 최적화된 번들링

## 추가 리소스

- [Vite 공식 문서](https://vitejs.dev/)
- [Vite + React 가이드](https://vitejs.dev/guide/)
- [환경 변수 가이드](https://vitejs.dev/guide/env-and-mode.html)
