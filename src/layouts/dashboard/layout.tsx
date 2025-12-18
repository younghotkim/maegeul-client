import type { Theme, SxProps, Breakpoint } from "@mui/material/styles";

import { useState } from "react";

import Box from "@mui/material/Box";
import Alert from "@mui/material/Alert";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";

import { _langs, _notifications } from "../../_mock";

import { Iconify } from "../../dashboardComponents/iconify";

import { Main } from "./main";
import { NavMobile, NavDesktop } from "./nav";
import { navData } from "../config-nav-dashboard";
import { Searchbar } from "../components/searchbar";
import { MenuButton } from "../components/menu-button";
import { HeaderSection } from "../core/header-section";
import { AccountPopover } from "../components/account-popover";
import { LanguagePopover } from "../components/language-popover";
import { NotificationsPopover } from "../components/notifications-popover";

// ----------------------------------------------------------------------

const NAV_WIDTH = 280;
const NAV_WIDTH_XL = 300;

export type DashboardLayoutProps = {
  sx?: SxProps<Theme>;
  children: React.ReactNode;
  header?: {
    sx?: SxProps<Theme>;
  };
};

export function DashboardLayout({
  sx,
  children,
  header,
}: DashboardLayoutProps) {
  const theme = useTheme();

  const [navMobileOpen, setNavMobileOpen] = useState(false);
  const [navDesktopOpen, setNavDesktopOpen] = useState(true);

  const layoutQuery: Breakpoint = "lg";

  // 화면 크기 감지 - 확실한 JavaScript 기반 처리
  const isDesktop = useMediaQuery(theme.breakpoints.up(layoutQuery));
  const isXl = useMediaQuery(theme.breakpoints.up("xl"));

  // 사이드바 너비 계산
  const currentNavWidth = isXl ? NAV_WIDTH_XL : NAV_WIDTH;
  const sidebarWidth = isDesktop && navDesktopOpen ? currentNavWidth : 0;

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        ...sx,
      }}
    >
      {/* 데스크톱 사이드바 - position: fixed */}
      {isDesktop && (
        <NavDesktop open={navDesktopOpen} width={currentNavWidth} />
      )}

      {/* 모바일 사이드바 - MUI Drawer */}
      <NavMobile
        data={navData}
        open={navMobileOpen}
        onClose={() => setNavMobileOpen(false)}
      />

      {/* 메인 콘텐츠 영역 */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          flex: "1 1 auto",
          minWidth: 0,
          // 사이드바 공간만큼 마진 적용
          ml: `${sidebarWidth}px`,
          transition: theme.transitions.create("margin-left", {
            duration: theme.transitions.duration.shorter,
            easing: theme.transitions.easing.easeInOut,
          }),
        }}
      >
        {/* 헤더 */}
        <HeaderSection
          layoutQuery={layoutQuery}
          slotProps={{
            container: {
              maxWidth: false,
              sx: { px: { [layoutQuery]: 5 } },
            },
          }}
          sx={header?.sx}
          slots={{
            topArea: (
              <Alert severity="info" sx={{ display: "none", borderRadius: 0 }}>
                This is an info Alert.
              </Alert>
            ),
            leftArea: (
              <>
                {/* 모바일 햄버거 버튼 */}
                {!isDesktop && (
                  <MenuButton
                    onClick={() => setNavMobileOpen(true)}
                    sx={{ ml: -0.5 }}
                    aria-label="모바일 메뉴 열기"
                  />
                )}
                {/* 데스크톱 햄버거 버튼 */}
                {isDesktop && (
                  <MenuButton
                    onClick={() => setNavDesktopOpen(!navDesktopOpen)}
                    sx={{ ml: -0.5 }}
                    aria-label={
                      navDesktopOpen ? "사이드바 닫기" : "사이드바 열기"
                    }
                  />
                )}
              </>
            ),
            rightArea: (
              <Box gap={1} display="flex" alignItems="center">
                <Searchbar />
                <LanguagePopover data={_langs} />
                <NotificationsPopover data={_notifications} />
                <AccountPopover
                  data={[
                    {
                      label: "홈",
                      href: "/",
                      icon: (
                        <Iconify
                          width={22}
                          icon="solar:home-angle-bold-duotone"
                        />
                      ),
                    },
                    {
                      label: "다크모드",
                      href: "#",
                      icon: (
                        <Iconify
                          width={22}
                          icon="solar:shield-keyhole-bold-duotone"
                        />
                      ),
                    },
                    {
                      label: "회원정보수정",
                      href: "#",
                      icon: (
                        <Iconify
                          width={22}
                          icon="solar:settings-bold-duotone"
                        />
                      ),
                    },
                  ]}
                />
              </Box>
            ),
          }}
        />

        {/* 메인 콘텐츠 */}
        <Main
          sx={{
            pt: theme.spacing(1),
            pb: theme.spacing(8),
            px: { xs: 2, sm: 3, lg: 5 },
          }}
        >
          {children}
        </Main>
      </Box>
    </Box>
  );
}
