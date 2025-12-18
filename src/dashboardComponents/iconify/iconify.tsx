import { forwardRef } from "react";
import { Icon, disableCache } from "@iconify/react";

import Box from "@mui/material/Box";

import { iconifyClasses } from "./classes";

import type { IconifyProps } from "./types";

// ----------------------------------------------------------------------

export const Iconify = forwardRef<SVGElement, IconifyProps>(
  ({ className, width = 20, sx, ...other }, ref) => {
    // width가 숫자인 경우 반응형으로 변환
    const responsiveWidth =
      typeof width === "number"
        ? { xs: width * 0.8, sm: width * 0.9, md: width }
        : width;

    return (
      <Box
        ssr
        ref={ref}
        component={Icon}
        className={iconifyClasses.root.concat(className ? ` ${className}` : "")}
        sx={{
          width: responsiveWidth,
          height: responsiveWidth,
          flexShrink: 0,
          display: "inline-flex",
          ...sx,
        }}
        {...other}
      />
    );
  }
);

// https://iconify.design/docs/iconify-icon/disable-cache.html
disableCache("local");
