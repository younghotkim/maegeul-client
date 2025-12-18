import { forwardRef } from "react";
import SimpleBar from "simplebar-react";

import Box from "@mui/material/Box";

import { scrollbarClasses } from "./classes";

import type { ScrollbarProps } from "./types";

// ----------------------------------------------------------------------

export const Scrollbar = forwardRef<HTMLDivElement, ScrollbarProps>(
  ({ slotProps, children, fillContent, sx, ...other }, ref) => (
    <Box
      scrollableNodeProps={{ ref }}
      clickOnTrack={false}
      className={scrollbarClasses.root}
      sx={{
        minWidth: 0,
        minHeight: 0,
        flexGrow: 1,
        display: "flex",
        flexDirection: "column",
        width: "100%",
        // 모바일에서 스크롤바 너비 조정
        "& .simplebar-scrollbar": {
          width: { xs: "6px", sm: "8px" },
        },
        "& .simplebar-track": {
          width: { xs: "6px", sm: "8px" },
        },
        "& .simplebar-wrapper": {
          ...(slotProps?.wrapper as React.CSSProperties),
          width: "100%",
        },
        "& .simplebar-content-wrapper": {
          ...(slotProps?.contentWrapper as React.CSSProperties),
          width: "100%",
        },
        "& .simplebar-content": {
          ...(fillContent && {
            minHeight: 1,
            display: "flex",
            flex: "1 1 auto",
            flexDirection: "column",
          }),
          width: "100%",
          ...slotProps?.content,
        } as React.CSSProperties,
        ...sx,
      }}
      {...other}
    >
      {children}
    </Box>
  )
);
