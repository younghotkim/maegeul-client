import type { Theme, SxProps, CSSObject } from "@mui/material/styles";

import Box from "@mui/material/Box";
import { useTheme } from "@mui/material/styles";
import GlobalStyles from "@mui/material/GlobalStyles";

import { baseVars } from "../config-vars";
import { layoutClasses } from "../classes";

// ----------------------------------------------------------------------

export type LayoutSectionProps = {
  sx?: SxProps<Theme>;
  cssVars?: CSSObject;
  children?: React.ReactNode;
  footerSection?: React.ReactNode;
  headerSection?: React.ReactNode;
  sidebarSection?: React.ReactNode;
};

export function LayoutSection({
  sx,
  cssVars,
  children,
  footerSection,
  headerSection,
  sidebarSection,
}: LayoutSectionProps) {
  const theme = useTheme();

  const inputGlobalStyles = (
    <GlobalStyles
      styles={{
        body: {
          ...baseVars(theme),
          ...cssVars,
        },
      }}
    />
  );

  return (
    <>
      {inputGlobalStyles}

      <Box
        id="root__layout"
        className={layoutClasses.root}
        sx={{
          display: "flex",
          minHeight: "100vh",
          flexDirection: "row",
          ...sx,
        }}
      >
        {/* 사이드바 - 조건부 렌더링으로 처리됨 */}
        {sidebarSection}

        {/* 메인 영역 (헤더 + 콘텐츠 + 푸터) */}
        <Box
          className={layoutClasses.hasSidebar}
          sx={{
            display: "flex",
            flex: "1 1 auto",
            flexDirection: "column",
            minWidth: 0, // flex 자식이 축소될 수 있도록
          }}
        >
          {headerSection}
          {children}
          {footerSection}
        </Box>
      </Box>
    </>
  );
}
