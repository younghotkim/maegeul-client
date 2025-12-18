import { forwardRef } from "react";

import Box from "@mui/material/Box";
import { useTheme } from "@mui/material/styles";

import { StyledLabel } from "./styles";
import { labelClasses } from "./classes";

import type { LabelProps } from "./types";

// ----------------------------------------------------------------------

export const Label = forwardRef<HTMLSpanElement, LabelProps>(
  (
    {
      children,
      color = "default",
      variant = "soft",
      startIcon,
      endIcon,
      sx,
      className,
      ...other
    },
    ref
  ) => {
    const theme = useTheme();

    const iconStyles = {
      width: { xs: 14, sm: 15, md: 16 },
      height: { xs: 14, sm: 15, md: 16 },
      "& svg, img": {
        width: 1,
        height: 1,
        objectFit: "cover",
      },
    };

    return (
      <StyledLabel
        ref={ref}
        component="span"
        className={labelClasses.root.concat(className ? ` ${className}` : "")}
        ownerState={{ color, variant }}
        sx={{
          ...(startIcon && { pl: { xs: 0.5, sm: 0.625, md: 0.75 } }),
          ...(endIcon && { pr: { xs: 0.5, sm: 0.625, md: 0.75 } }),
          fontSize: { xs: "0.6875rem", sm: "0.75rem", md: "0.8125rem" },
          height: { xs: 20, sm: 22, md: 24 },
          minWidth: { xs: 20, sm: 22, md: 24 },
          px: { xs: 0.5, sm: 0.625, md: 0.75 },
          ...sx,
        }}
        theme={theme}
        {...other}
      >
        {startIcon && (
          <Box
            component="span"
            className={labelClasses.icon}
            sx={{ mr: { xs: 0.5, sm: 0.625, md: 0.75 }, ...iconStyles }}
          >
            {startIcon}
          </Box>
        )}

        {typeof children === "string" ? sentenceCase(children) : children}

        {endIcon && (
          <Box
            component="span"
            className={labelClasses.icon}
            sx={{ ml: { xs: 0.5, sm: 0.625, md: 0.75 }, ...iconStyles }}
          >
            {endIcon}
          </Box>
        )}
      </StyledLabel>
    );
  }
);

// ----------------------------------------------------------------------

function sentenceCase(string: string): string {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
