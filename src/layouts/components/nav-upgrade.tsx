import type { StackProps } from "@mui/material/Stack";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

import { textGradient } from "../../theme/styles";

// ----------------------------------------------------------------------

export function NavUpgrade({ sx, ...other }: StackProps) {
  return (
    <Box
      display="flex"
      alignItems="center"
      flexDirection="column"
      sx={{
        mb: { xs: 2, sm: 3, md: 4 },
        px: { xs: 1, sm: 1.5, md: 2 },
        textAlign: "center",
        ...sx,
      }}
      {...other}
    >
      <Typography
        variant="h6"
        sx={(theme) => ({
          ...textGradient(
            `to right, ${theme.vars.palette.secondary.main}, ${theme.vars.palette.warning.main}`
          ),
          fontSize: { xs: "0.875rem", sm: "1rem", md: "1.25rem" },
          lineHeight: { xs: 1.4, sm: 1.5 },
        })}
      >
        매일 글쓰기 플랫폼: maegeul
      </Typography>
      <Typography
        variant="body2"
        sx={{
          color: "text.secondary",
          mt: { xs: 0.25, sm: 0.5 },
          fontSize: { xs: "0.75rem", sm: "0.8125rem", md: "0.875rem" },
        }}
      >
        {`Created By `}
        <Box component="strong" sx={{ color: "text.primary" }}>
          릿미
        </Box>
      </Typography>

      <Box
        component="img"
        src=""
        sx={{
          width: { xs: 120, sm: 160, md: 200 },
          my: { xs: 1, sm: 1.5, md: 2 },
          maxWidth: "100%",
        }}
      />

      <Button
        href="https:/github.com/younghotkim/maegeul/"
        target="_blank"
        variant="contained"
        color="inherit"
        sx={{
          fontSize: { xs: "0.75rem", sm: "0.8125rem", md: "0.875rem" },
          px: { xs: 1.5, sm: 2, md: 2.5 },
          py: { xs: 0.5, sm: 0.625, md: 0.75 },
          minWidth: { xs: "auto", sm: "120px" },
        }}
      >
        Github로 바로가기
      </Button>
    </Box>
  );
}
