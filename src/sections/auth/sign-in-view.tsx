import { useState, useCallback } from "react";

import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import LoadingButton from "@mui/lab/LoadingButton";
import InputAdornment from "@mui/material/InputAdornment";
import { alpha, useTheme } from "@mui/material/styles";

import { useRouter } from "../../routes/hooks";
import { Iconify } from "../../dashboardComponents/iconify";

// ----------------------------------------------------------------------

export function SignInView() {
  const router = useRouter();
  const theme = useTheme();

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = useCallback(() => {
    setIsLoading(true);
    setTimeout(() => {
      router.push("/");
      setIsLoading(false);
    }, 1000);
  }, [router]);

  const renderForm = (
    <Box display="flex" flexDirection="column" gap={2.5}>
      <TextField
        fullWidth
        name="email"
        label="이메일"
        placeholder="example@email.com"
        InputLabelProps={{ shrink: true }}
        sx={{
          "& .MuiOutlinedInput-root": {
            borderRadius: 2,
            "&:hover fieldset": {
              borderColor: theme.palette.primary.main,
            },
          },
        }}
      />

      <Box>
        <Box display="flex" justifyContent="flex-end" mb={1}>
          <Link
            variant="body2"
            color="primary"
            sx={{
              cursor: "pointer",
              "&:hover": { textDecoration: "underline" },
            }}
          >
            비밀번호를 잊으셨나요?
          </Link>
        </Box>
        <TextField
          fullWidth
          name="password"
          label="비밀번호"
          placeholder="비밀번호를 입력하세요"
          InputLabelProps={{ shrink: true }}
          type={showPassword ? "text" : "password"}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowPassword(!showPassword)}
                  edge="end"
                  sx={{
                    color: "text.secondary",
                    "&:hover": {
                      backgroundColor: alpha(theme.palette.primary.main, 0.08),
                    },
                  }}
                >
                  <Iconify
                    icon={
                      showPassword ? "solar:eye-bold" : "solar:eye-closed-bold"
                    }
                  />
                </IconButton>
              </InputAdornment>
            ),
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: 2,
              "&:hover fieldset": {
                borderColor: theme.palette.primary.main,
              },
            },
          }}
        />
      </Box>

      <LoadingButton
        fullWidth
        size="large"
        type="submit"
        variant="contained"
        loading={isLoading}
        onClick={handleSignIn}
        sx={{
          mt: 1,
          py: 1.5,
          borderRadius: 2,
          fontWeight: 600,
          fontSize: "1rem",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          boxShadow: `0 4px 14px ${alpha("#667eea", 0.4)}`,
          "&:hover": {
            background: "linear-gradient(135deg, #5a6fd6 0%, #6a4190 100%)",
            boxShadow: `0 6px 20px ${alpha("#667eea", 0.5)}`,
          },
        }}
      >
        로그인
      </LoadingButton>
    </Box>
  );

  return (
    <Box
      sx={{
        maxWidth: 400,
        mx: "auto",
        p: { xs: 3, sm: 4 },
      }}
    >
      <Box
        gap={1}
        display="flex"
        flexDirection="column"
        alignItems="center"
        sx={{ mb: 4 }}
      >
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          로그인
        </Typography>
        <Typography variant="body2" color="text.secondary">
          계정이 없으신가요?{" "}
          <Link
            href="/mainsignup"
            variant="subtitle2"
            sx={{
              color: "primary.main",
              fontWeight: 600,
              cursor: "pointer",
              "&:hover": { textDecoration: "underline" },
            }}
          >
            회원가입
          </Link>
        </Typography>
      </Box>

      {renderForm}

      <Box
        sx={{
          my: 3,
          display: "flex",
          alignItems: "center",
          gap: 2,
        }}
      >
        <Box sx={{ flex: 1, height: "1px", bgcolor: "divider" }} />
        <Typography variant="caption" sx={{ color: "text.secondary", px: 1 }}>
          또는
        </Typography>
        <Box sx={{ flex: 1, height: "1px", bgcolor: "divider" }} />
      </Box>

      <Box gap={1.5} display="flex" justifyContent="center">
        <IconButton
          sx={{
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: 2,
            p: 1.5,
            "&:hover": {
              backgroundColor: alpha(theme.palette.primary.main, 0.04),
              borderColor: theme.palette.primary.main,
            },
          }}
        >
          <Iconify icon="logos:google-icon" width={24} />
        </IconButton>
        <IconButton
          sx={{
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: 2,
            p: 1.5,
            "&:hover": {
              backgroundColor: alpha(theme.palette.primary.main, 0.04),
              borderColor: theme.palette.primary.main,
            },
          }}
        >
          <Iconify icon="ri:kakao-talk-fill" width={24} />
        </IconButton>
      </Box>
    </Box>
  );
}
