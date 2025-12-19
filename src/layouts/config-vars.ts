import type { Theme } from "@mui/material/styles";

import { varAlpha } from "../theme/styles";

// ----------------------------------------------------------------------

export const baseVars = (theme: Theme) => ({
  // nav - 불투명 배경으로 가시성 개선
  "--layout-nav-bg": theme.vars.palette.background.paper,
  "--layout-nav-border-color": varAlpha(
    theme.vars.palette.grey["500Channel"],
    0.2
  ),
  "--layout-nav-zIndex": 1201,
  "--layout-nav-mobile-width": "320px",
  // nav item
  "--layout-nav-item-height": "44px",
  "--layout-nav-item-color": theme.vars.palette.text.secondary,
  "--layout-nav-item-active-color": theme.vars.palette.primary.main,
  "--layout-nav-item-active-bg": varAlpha(
    theme.vars.palette.primary.mainChannel,
    0.08
  ),
  "--layout-nav-item-hover-bg": varAlpha(
    theme.vars.palette.primary.mainChannel,
    0.16
  ),
  // header
  "--layout-header-blur": "8px",
  "--layout-header-zIndex": 1200,
  "--layout-header-mobile-height": "64px",
  "--layout-header-desktop-height": "72px",
});
