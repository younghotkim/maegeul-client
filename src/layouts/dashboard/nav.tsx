import type { Theme, SxProps } from "@mui/material/styles";

import { useEffect } from "react";

import Box from "@mui/material/Box";
import ListItem from "@mui/material/ListItem";
import { useTheme } from "@mui/material/styles";
import ListItemButton from "@mui/material/ListItemButton";
import Drawer, { drawerClasses } from "@mui/material/Drawer";

import { usePathname } from "../../routes/hooks";
import { RouterLink } from "../../routes/components";

import { varAlpha } from "../../theme/styles";

import { Scrollbar } from "../../dashboardComponents/scrollbar";

import { navData } from "../config-nav-dashboard";
import { NavUpgrade } from "../components/nav-upgrade";

// ----------------------------------------------------------------------

export type NavContentProps = {
  data: {
    path: string;
    title: string;
    icon: React.ReactNode;
    info?: React.ReactNode;
  }[];
  slots?: {
    topArea?: React.ReactNode;
    bottomArea?: React.ReactNode;
  };
  sx?: SxProps<Theme>;
};

// ----------------------------------------------------------------------
// 데스크톱 사이드바 - 간단하고 확실한 구현
// ----------------------------------------------------------------------

type NavDesktopProps = {
  open: boolean;
  width: number;
};

export function NavDesktop({ open, width }: NavDesktopProps) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        height: "100vh",
        width: open ? width : 0,
        bgcolor: "var(--layout-nav-bg)",
        borderRight: open
          ? `1px solid var(--layout-nav-border-color, ${varAlpha(
              theme.vars.palette.grey["500Channel"],
              0.12
            )})`
          : "none",
        zIndex: theme.zIndex.drawer,
        overflow: "hidden",
        transition: theme.transitions.create("width", {
          duration: theme.transitions.duration.shorter,
          easing: theme.transitions.easing.easeInOut,
        }),
      }}
    >
      {/* 내부 콘텐츠 - open 상태일 때만 보임 */}
      <Box
        sx={{
          width: width,
          height: "100%",
          pt: 2.5,
          px: 2.5,
          display: "flex",
          flexDirection: "column",
          opacity: open ? 1 : 0,
          visibility: open ? "visible" : "hidden",
          transition: theme.transitions.create(["opacity", "visibility"], {
            duration: theme.transitions.duration.shorter,
          }),
        }}
      >
        <NavContent data={navData} />
      </Box>
    </Box>
  );
}

// ----------------------------------------------------------------------
// 모바일 사이드바 - MUI Drawer 사용
// ----------------------------------------------------------------------

type NavMobileProps = NavContentProps & {
  open: boolean;
  onClose: () => void;
};

export function NavMobile({ data, open, onClose }: NavMobileProps) {
  const pathname = usePathname();

  // 페이지 이동 시 자동으로 닫기
  useEffect(() => {
    if (open) {
      onClose();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return (
    <Drawer
      open={open}
      onClose={onClose}
      anchor="left"
      ModalProps={{ keepMounted: true }}
      sx={{
        [`& .${drawerClasses.paper}`]: {
          pt: 2.5,
          px: 2.5,
          width: 280,
          bgcolor: "var(--layout-nav-bg)",
        },
      }}
    >
      <NavContent data={data} />
    </Drawer>
  );
}

// ----------------------------------------------------------------------
// 네비게이션 콘텐츠 (공통)
// ----------------------------------------------------------------------

export function NavContent({ data, slots, sx }: NavContentProps) {
  const pathname = usePathname();

  return (
    <>
      {slots?.topArea}

      <Scrollbar fillContent>
        <Box
          component="nav"
          sx={{
            display: "flex",
            flex: "1 1 auto",
            flexDirection: "column",
            ...sx,
          }}
        >
          <Box
            component="ul"
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 0.5,
              p: 0,
              m: 0,
              listStyle: "none",
            }}
          >
            {data.map((item) => {
              const isActive = item.path === pathname;

              return (
                <ListItem disableGutters disablePadding key={item.title}>
                  <ListItemButton
                    disableGutters
                    component={RouterLink}
                    href={item.path}
                    sx={{
                      pl: 2,
                      py: 1,
                      pr: 1.5,
                      gap: 2,
                      borderRadius: 0.75,
                      typography: "body2",
                      fontWeight: "fontWeightMedium",
                      color: "var(--layout-nav-item-color)",
                      minHeight: 44,
                      ...(isActive && {
                        fontWeight: "fontWeightSemiBold",
                        bgcolor: "var(--layout-nav-item-active-bg)",
                        color: "var(--layout-nav-item-active-color)",
                        "&:hover": {
                          bgcolor: "var(--layout-nav-item-hover-bg)",
                        },
                      }),
                    }}
                  >
                    <Box
                      component="span"
                      sx={{
                        width: 24,
                        height: 24,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      {item.icon}
                    </Box>

                    <Box
                      component="span"
                      sx={{
                        flexGrow: 1,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {item.title}
                    </Box>

                    {item.info && (
                      <Box sx={{ flexShrink: 0, ml: 1 }}>{item.info}</Box>
                    )}
                  </ListItemButton>
                </ListItem>
              );
            })}
          </Box>
        </Box>
      </Scrollbar>

      {slots?.bottomArea}

      <NavUpgrade />
    </>
  );
}
