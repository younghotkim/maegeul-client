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

  // 환경 변수에서 BASE_URL을 가져오고, 없으면 동적으로 현재 호스트 사용
  const getBaseURL = () => {
    const envUrl = import.meta.env.VITE_BASE_URL;
    // 환경 변수가 있고, placeholder가 아니고, 유효한 URL인 경우에만 사용
    if (
      envUrl &&
      !envUrl.includes("YOUR_SERVER_IP") &&
      envUrl.startsWith("http")
    ) {
      return envUrl.endsWith("/") ? envUrl + "api/" : envUrl + "/api/";
    }
    if (import.meta.env.MODE === "production") {
      return "/api/";
    }
    // 개발 환경에서는 현재 호스트의 IP 사용 (외부 접속 가능)
    const protocol = window.location.protocol;
    const hostname = window.location.hostname;
    return `${protocol}//${hostname}:5001/api/`;
  };

  const BASE_URL = getBaseURL();

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
            user?.isKakaoUser && user?.profile_picture
              ? user.profile_picture // 카카오 프로필 사진
              : user?.profile_picture
              ? `${BASE_URL}${user.profile_picture}` // DB에 저장된 경로 사용
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
