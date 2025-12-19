import React, { useEffect, lazy, Suspense } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { queryClient } from "./lib/query-client";
import { useThemeStore } from "./hooks/stores/use-theme-store";
import { useAuthStore } from "./hooks/stores/use-auth-store";
import { HelmetProvider } from "react-helmet-async";
import { DashboardWrapper } from "./layouts/DashboardWrapper";
import { AuthInitializer } from "./components/AuthInitializer";
// Context Provider 제거 - Store 사용으로 전환

// Eager loading for critical pages
import Home from "./pages/Home";
import MainLogin from "./pages/Auth/MainLogin";
import MainSignup from "./pages/Auth/MainSignup";

// Lazy loading for other pages
const MaeGeul = lazy(() => import("./pages/MaeGeul/Maeguel"));
const MgWriting = lazy(() => import("./pages/MaeGeul/MgWriting"));
const Dashboard = lazy(() => import("./pages/Archiving/Dashboard"));
const Mypage = lazy(() => import("./pages/Auth/Mypage"));
const EmailLogin = lazy(() => import("./pages/Auth/EmailLogin"));
const SignupForm = lazy(() => import("./pages/Auth/SignupStep1"));
const SignupForm2 = lazy(() => import("./pages/Auth/SignupStep2"));
const SignupForm3 = lazy(() => import("./pages/Auth/SignupStep3"));
const Logout = lazy(() => import("./pages/Auth/Logout"));
const LoginSuccess = lazy(() => import("./pages/Auth/LoginSuccess"));
const KakaoCallback = lazy(() => import("./pages/Auth/KakaoCallback"));
const Blog = lazy(() => import("./pages/Dashboard/blog"));
const User = lazy(() => import("./pages/Dashboard/user"));

// Loading component
const LoadingFallback = () => (
  <div className="flex min-h-screen items-center justify-center bg-background">
    <div className="text-center">
      <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      <p className="mt-4 text-sm text-muted-foreground">로딩 중...</p>
    </div>
  </div>
);

// Theme synchronization component
function ThemeSync() {
  const isDarkMode = useThemeStore((state) => state.isDarkMode);

  useEffect(() => {
    // 초기 로드 시 다크모드 적용
    if (isDarkMode) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  }, [isDarkMode]);

  return null;
}

// Auth loading component - 인증 초기화 중 표시
const AuthLoadingFallback = () => (
  <div className="flex min-h-screen items-center justify-center bg-background">
    <div className="text-center">
      <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      <p className="mt-4 text-sm text-muted-foreground">인증 확인 중...</p>
    </div>
  </div>
);

// App content wrapper - 인증 초기화 완료 후 렌더링
function AppContent() {
  const isInitialized = useAuthStore((state) => state.isInitialized);

  if (!isInitialized) {
    return <AuthLoadingFallback />;
  }

  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        {/* 메인 앱 라우트 (Material-UI 없음) */}
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/maegeul" element={<MaeGeul />} />
        <Route path="/mgwriting" element={<MgWriting />} />
        <Route path="/login/success" element={<LoginSuccess />} />
        <Route path="/email-login" element={<EmailLogin />} />
        <Route path="/mypage" element={<Mypage />} />
        <Route path="/mainlogin" element={<MainLogin />} />
        <Route path="/mainsignup" element={<MainSignup />} />
        <Route path="/kakao/callback" element={<KakaoCallback />} />
        <Route path="/signupstep1" element={<SignupForm />} />
        <Route path="/signupstep2" element={<SignupForm2 />} />
        <Route path="/signupstep3" element={<SignupForm3 />} />
        <Route path="/logout" element={<Logout />} />

        {/* Dashboard 라우트 (Material-UI ThemeProvider 적용) */}
        <Route
          path="/dashboard"
          element={
            <DashboardWrapper>
              <Dashboard />
            </DashboardWrapper>
          }
        />
        <Route
          path="/contents"
          element={
            <DashboardWrapper>
              <Blog />
            </DashboardWrapper>
          }
        />
        <Route
          path="/diary"
          element={
            <DashboardWrapper>
              <User />
            </DashboardWrapper>
          }
        />
      </Routes>
    </Suspense>
  );
}

const App: React.FC = () => {
  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <ThemeSync />
        <AuthInitializer />
        <Router>
          <AppContent />
        </Router>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </HelmetProvider>
  );
};

export default App;
