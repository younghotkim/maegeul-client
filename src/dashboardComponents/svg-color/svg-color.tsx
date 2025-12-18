import { forwardRef } from "react";

import Box from "@mui/material/Box";

import { svgColorClasses } from "./classes";

import type { SvgColorProps } from "./types";

// ----------------------------------------------------------------------

export const SvgColor = forwardRef<HTMLSpanElement, SvgColorProps>(
  ({ src, width = 24, height, className, sx, ...other }, ref) => {
    // width가 숫자인 경우 반응형으로 변환
    const responsiveWidth =
      typeof width === "number"
        ? { xs: width * 0.8, sm: width * 0.9, md: width }
        : width;

    const responsiveHeight =
      height !== undefined
        ? typeof height === "number"
          ? { xs: height * 0.8, sm: height * 0.9, md: height }
          : height
        : responsiveWidth;

    return (
      <Box
        ref={ref}
        component="span"
        className={svgColorClasses.root.concat(
          className ? ` ${className}` : ""
        )}
        sx={{
          width: responsiveWidth,
          flexShrink: 0,
          height: responsiveHeight,
          display: "inline-flex",
          bgcolor: "currentColor",
          mask: `url(${src}) no-repeat center / contain`,
          WebkitMask: `url(${src}) no-repeat center / contain`,
          ...sx,
        }}
        {...other}
      />
    );
  }
);
