import type { CardProps } from "@mui/material/Card";
import type { ColorType } from "../../theme/core/palette";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import { useTheme, alpha } from "@mui/material/styles";
import { useEffect, useState, useRef } from "react";

import { fShortenNumber } from "../../utils/format-number";

// ----------------------------------------------------------------------

type Props = CardProps & {
  title: string;
  total: number;
  color?: ColorType;
  icon: React.ReactNode;
  chart: {};
};

// 숫자 카운트업 애니메이션 훅
function useCountUp(end: number, duration: number = 1500) {
  const [count, setCount] = useState(0);
  const countRef = useRef(0);
  const startTimeRef = useRef<number | null>(null);

  useEffect(() => {
    countRef.current = 0;
    startTimeRef.current = null;

    const animate = (timestamp: number) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const progress = timestamp - startTimeRef.current;
      const percentage = Math.min(progress / duration, 1);

      // easeOutExpo 이징
      const easeOut = 1 - Math.pow(2, -10 * percentage);
      const currentCount = Math.floor(easeOut * end);

      setCount(currentCount);

      if (percentage < 1) {
        requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    };

    requestAnimationFrame(animate);
  }, [end, duration]);

  return count;
}

export function AnalyticsWidgetSummary({
  icon,
  title,
  total,
  chart,
  color = "primary",
  sx,
  ...other
}: Props) {
  const theme = useTheme();
  const animatedTotal = useCountUp(total, 1200);

  return (
    <Card
      sx={{
        p: 3,
        position: "relative",
        overflow: "hidden",
        backgroundColor: "background.paper",
        borderRadius: 3,
        boxShadow: `0 4px 20px ${alpha(theme.palette.grey[500], 0.12)}`,
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: `0 12px 28px ${alpha(theme.palette.grey[500], 0.2)}`,
        },
        ...sx,
      }}
      {...other}
    >
      {/* 배경 장식 */}
      <Box
        sx={{
          position: "absolute",
          top: -40,
          right: -40,
          width: 120,
          height: 120,
          borderRadius: "50%",
          background: `linear-gradient(135deg, ${alpha(
            theme.palette[color].main,
            0.08
          )} 0%, ${alpha(theme.palette[color].light, 0.04)} 100%)`,
        }}
      />
      <Box
        sx={{
          position: "absolute",
          bottom: -20,
          left: -20,
          width: 80,
          height: 80,
          borderRadius: "50%",
          background: `linear-gradient(135deg, ${alpha(
            theme.palette[color].light,
            0.06
          )} 0%, transparent 100%)`,
        }}
      />

      {/* 아이콘 */}
      <Box sx={{ mb: 3, position: "relative", zIndex: 1 }}>{icon}</Box>

      {/* 콘텐츠 */}
      <Box sx={{ position: "relative", zIndex: 1 }}>
        <Box
          sx={{
            mb: 0.5,
            typography: "subtitle2",
            color: "text.secondary",
            fontWeight: 500,
          }}
        >
          {title}
        </Box>
        <Box
          sx={{
            typography: "h3",
            fontWeight: 700,
            background: `linear-gradient(135deg, ${theme.palette[color].main} 0%, ${theme.palette[color].dark} 100%)`,
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          {fShortenNumber(animatedTotal)}
        </Box>
      </Box>
    </Card>
  );
}
