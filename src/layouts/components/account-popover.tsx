//src/layouts/components/account-popover.tsx
import type { IconButtonProps } from "@mui/material/IconButton";
import { useState, useCallback, useEffect } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";
import Popover from "@mui/material/Popover";
import Divider from "@mui/material/Divider";
import MenuList from "@mui/material/MenuList";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuItem, { menuItemClasses } from "@mui/material/MenuItem";
import { useRouter, usePathname } from "../../routes/hooks";
import { useAuthStore } from "../../hooks/stores/use-auth-store";
import { useNavigate } from "react-router-dom";

// ----------------------------------------------------------------------

export type AccountPopoverProps = IconButtonProps & {
  data?: {
    label: string;
    href: string;
    icon?: React.ReactNode;
    info?: React.ReactNode;
    onclick?(): void; // 알림설정 클릭되게 Menu Item에 Event걸기 추가
  }[];
};

export function AccountPopover({
  data = [],
  sx,
  ...other
}: AccountPopoverProps) {
  const router = useRouter();
  const navigate = useNavigate();
  const pathname = usePathname();
  const user = useAuthStore((state) => state.user); // Store에서 user 가져오기
  const logout = useAuthStore((state) => state.logout); // Store에서 logout 함수 가져오기

  // 환경 변수에서 API URL을 가져옴
  const getAPIURL = () => {
    const envUrl = import.meta.env.VITE_API_URL;

    // 환경 변수가 있고, placeholder가 아니고, 유효한 URL인 경우에만 사용
    if (
      envUrl &&
      !envUrl.includes("YOUR_SERVER_IP") &&
      envUrl.startsWith("http")
    ) {
      // /api 제거하고 서버 베이스 URL 반환
      return envUrl.replace(/\/api$/, "");
    }

    // 환경 변수가 없으면 에러
    console.error("❌ VITE_API_URL 환경 변수가 설정되지 않았습니다.");
    console.error("개발 환경에서는 .env 파일에 VITE_API_URL을 설정하세요.");
    console.error("프로덕션 환경에서는 Vercel 환경 변수를 확인하세요.");
    throw new Error(
      "VITE_API_URL 환경 변수가 필요합니다. .env 파일 또는 Vercel 환경 변수를 확인하세요."
    );
  };

  const API_URL = getAPIURL();

  const [openPopover, setOpenPopover] = useState<HTMLButtonElement | null>(
    null
  );

  const isAuthenticated = useAuthStore((state) => state.isAuthenticated); // Store에서 인증 상태 가져오기

  const handleOpenPopover = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      setOpenPopover(event.currentTarget);
    },
    []
  );

  const handleClosePopover = useCallback(() => {
    setOpenPopover(null);
  }, []);

  const handleClickItem = useCallback(
    (path: string, onClick?: () => void) => {
      handleClosePopover();
      if (onClick) {
        onClick();
      } else {
        router.push(path);
      }
    },
    [handleClosePopover, router]
  );

  const handleLogout = () => {
    // Store의 logout 함수 사용 (토큰 삭제 및 사용자 정보 초기화)
    logout();
    navigate("/mainlogin"); // 로그아웃 후 메인 페이지로 리다이렉트
  };

  return (
    <>
      <IconButton
        onClick={handleOpenPopover}
        sx={{
          p: "2px",
          width: 46,
          height: 46,
          background: (theme) => {
            // ThemeProvider가 없는 경우 기본 그라데이션 사용
            if (!theme?.vars?.palette) {
              return "conic-gradient(#e0e7ff, #fef3c7, #e0e7ff)"; // 기본 보라색/노란색 그라데이션
            }
            return `conic-gradient(${theme.vars.palette.primary.light}, ${theme.vars.palette.warning.light}, ${theme.vars.palette.primary.light})`;
          },
          ...sx,
        }}
        {...other}
      >
        <Avatar
          src={
            user?.profile_picture
              ? (() => {
                  // Vercel Blob URL 또는 완전한 URL인 경우 그대로 사용
                  if (
                    user.profile_picture.startsWith("http://") ||
                    user.profile_picture.startsWith("https://")
                  ) {
                    console.log(
                      "✅ 프로필 사진 URL (완전한 URL):",
                      user.profile_picture
                    );
                    return user.profile_picture;
                  }
                  // 상대 경로인 경우 API_URL 추가
                  const fullUrl = `${API_URL}${user.profile_picture}`;
                  console.log("🔧 프로필 사진 URL (상대 경로):", fullUrl);
                  return fullUrl;
                })()
              : undefined
          }
          alt={user?.profile_name || "Guest"}
          sx={{ width: 1, height: 1 }}
        >
          {!user?.profile_picture &&
            (user?.profile_name?.charAt(0).toUpperCase() || "G")}
        </Avatar>
      </IconButton>

      <Popover
        open={!!openPopover}
        anchorEl={openPopover}
        onClose={handleClosePopover}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        slotProps={{
          paper: {
            sx: { width: 200 },
          },
        }}
      >
        <Box sx={{ p: 2, pb: 1.5 }}>
          <Typography variant="subtitle2" noWrap>
            {user?.profile_name || "Guest"}
          </Typography>

          <Typography variant="body2" sx={{ color: "text.secondary" }} noWrap>
            {user?.email || "이메일 없음"}
          </Typography>
        </Box>

        <Divider sx={{ borderStyle: "dashed" }} />

        <MenuList
          disablePadding
          sx={{
            p: 1,
            gap: 0.5,
            display: "flex",
            flexDirection: "column",
            [`& .${menuItemClasses.root}`]: {
              px: 1,
              gap: 2,
              borderRadius: 0.75,
              color: "text.secondary",
              "&:hover": { color: "text.primary" },
              [`&.${menuItemClasses.selected}`]: {
                color: "text.primary",
                bgcolor: "action.selected",
                fontWeight: "fontWeightSemiBold",
              },
            },
          }}
        >
          {data.map((option) => (
            <MenuItem
              key={option.label}
              selected={option.href === pathname}
              onClick={() => handleClickItem(option.href, option.onclick)}
            >
              {option.icon}
              {option.label}
            </MenuItem>
          ))}
        </MenuList>

        <Divider sx={{ borderStyle: "dashed" }} />

        <Box sx={{ p: 1 }}>
          <Button
            fullWidth
            color="error"
            size="medium"
            variant="text"
            onClick={handleLogout}
          >
            로그아웃
          </Button>
        </Box>
      </Popover>
    </>
  );
}
