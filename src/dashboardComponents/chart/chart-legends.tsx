import type { BoxProps } from "@mui/material/Box";

import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import { styled } from "@mui/material/styles";

// ----------------------------------------------------------------------

export const StyledLegend = styled(Box)(({ theme }) => ({
  gap: 6,
  alignItems: "center",
  display: "inline-flex",
  justifyContent: "flex-start",
  fontSize: theme.typography.pxToRem(13),
  fontWeight: theme.typography.fontWeightMedium,
}));

export const StyledDot = styled(Box)(() => ({
  width: 12,
  height: 12,
  flexShrink: 0,
  display: "flex",
  borderRadius: "50%",
  position: "relative",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: "currentColor",
}));

// ----------------------------------------------------------------------

type Props = BoxProps & {
  labels?: string[];
  colors?: string[];
  values?: string[];
  sublabels?: string[];
  icons?: React.ReactNode[];
};

export function ChartLegends({
  icons,
  values,
  sublabels,
  labels = [],
  colors = [],
  ...other
}: Props) {
  return (
    <Box
      gap={{ xs: 1.5, sm: 2 }}
      display="flex"
      flexWrap="wrap"
      justifyContent={{ xs: "center", sm: "flex-start" }}
      {...other}
    >
      {labels?.map((series, index) => (
        <Stack
          key={series}
          spacing={{ xs: 0.5, sm: 1 }}
          sx={{
            minWidth: { xs: "100%", sm: "auto" },
            alignItems: { xs: "center", sm: "flex-start" },
          }}
        >
          <StyledLegend
            sx={{
              fontSize: { xs: "0.75rem", sm: "0.8125rem", md: "0.875rem" },
              gap: { xs: 4, sm: 6 },
            }}
          >
            {icons?.length ? (
              <Box
                component="span"
                sx={{
                  color: colors[index],
                  "& svg, & img": {
                    width: { xs: 16, sm: 18, md: 20 },
                    height: { xs: 16, sm: 18, md: 20 },
                  },
                }}
              >
                {icons?.[index]}
              </Box>
            ) : (
              <StyledDot
                component="span"
                sx={{
                  color: colors[index],
                  width: { xs: 10, sm: 11, md: 12 },
                  height: { xs: 10, sm: 11, md: 12 },
                }}
              />
            )}

            <Box
              component="span"
              sx={{
                flexShrink: 0,
                fontSize: { xs: "0.75rem", sm: "0.8125rem", md: "0.875rem" },
              }}
            >
              {series}
              {sublabels && (
                <>
                  {" "}
                  <Box
                    component="span"
                    sx={{
                      display: { xs: "block", sm: "inline" },
                      fontSize: { xs: "0.7rem", sm: "0.75rem" },
                    }}
                  >
                    {`(${sublabels[index]})`}
                  </Box>
                </>
              )}
            </Box>
          </StyledLegend>

          {values && (
            <Box
              sx={{
                typography: { xs: "body2", sm: "h6" },
                fontSize: { xs: "0.875rem", sm: "1rem", md: "1.25rem" },
                textAlign: { xs: "center", sm: "left" },
              }}
            >
              {values[index]}
            </Box>
          )}
        </Stack>
      ))}
    </Box>
  );
}
