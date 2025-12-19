import { forwardRef } from "react";
import SimpleBar from "simplebar-react";

import Box from "@mui/material/Box";

import { scrollbarClasses } from "./classes";

import type { ScrollbarProps } from "./types";

// ----------------------------------------------------------------------

export const Scrollbar = forwardRef<HTMLDivElement, ScrollbarProps>(
  ({ slotProps, children, fillContent, sx, ...other }, ref) => (
    <Box
      ref={ref}
      className={scrollbarClasses.root}
      sx={{
        minWidth: 0,
        minHeight: 0,
        flexGrow: 1,
        display: "flex",
        flexDirection: "column",
        width: "100%",
        overflow: "auto",
        // 스크롤바 스타일링
        "&::-webkit-scrollbar": {
          width: { xs: "6px", sm: "8px" },
          height: { xs: "6px", sm: "8px" },
        },
        "&::-webkit-scrollbar-thumb": {
          backgroundColor: "rgba(0, 0, 0, 0.2)",
          borderRadius: "4px",
        },
        "&::-webkit-scrollbar-track": {
          backgroundColor: "transparent",
        },
        ...(fillContent && {
          "& > *": {
            minHeight: 1,
            display: "flex",
            flex: "1 1 auto",
            flexDirection: "column",
          },
        }),
        ...sx,
      }}
      {...other}
    >
      {children}
    </Box>
  )
);
