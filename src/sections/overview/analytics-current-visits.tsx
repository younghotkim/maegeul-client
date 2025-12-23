import type { CardProps } from "@mui/material/Card";
import type { ChartOptions } from "../../dashboardComponents/chart";

import Card from "@mui/material/Card";
import Divider from "@mui/material/Divider";
import { useTheme, alpha } from "@mui/material/styles";
import CardHeader from "@mui/material/CardHeader";
import Box from "@mui/material/Box";

import { fNumber } from "../../utils/format-number";

import { Chart, useChart, ChartLegends } from "../../dashboardComponents/chart";

// ----------------------------------------------------------------------

type Props = CardProps & {
  title?: string;
  subheader?: string;
  chart: {
    colors?: string[];
    series: {
      label: string;
      value: number;
    }[];
    options?: ChartOptions;
  };
};

export function AnalyticsCurrentVisits({
  title,
  subheader,
  chart,
  ...other
}: Props) {
  const theme = useTheme();

  const chartSeries = chart.series.map((item) => item.value);

  // 개선된 그라데이션 색상 팔레트
  const chartColors = chart.colors ?? [
    "#667eea", // 보라-파랑
    "#f5576c", // 핑크-레드
    "#4facfe", // 하늘색
    "#fa709a", // 핑크
    "#38ef7d", // 민트
    "#fee140", // 노랑
  ];

  const chartOptions = useChart({
    chart: { sparkline: { enabled: true } },
    colors: chartColors,
    labels: chart.series.map((item) => item.label),
    stroke: { width: 2, colors: ["#fff"] },
    dataLabels: {
      enabled: true,
      dropShadow: { enabled: false },
      style: {
        fontSize: "12px",
        fontWeight: 600,
      },
    },
    tooltip: {
      y: {
        formatter: (value: number) => fNumber(value),
        title: { formatter: (seriesName: string) => `${seriesName}` },
      },
    },
    plotOptions: {
      pie: {
        donut: { labels: { show: false } },
        expandOnClick: true,
      },
    },
    ...chart.options,
  });

  return (
    <Card
      sx={{
        borderRadius: 3,
        boxShadow: `0 4px 20px ${alpha(theme.palette.grey[500], 0.12)}`,
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        "&:hover": {
          boxShadow: `0 8px 24px ${alpha(theme.palette.grey[500], 0.16)}`,
        },
      }}
      {...other}
    >
      <CardHeader
        title={title}
        subheader={subheader}
        titleTypographyProps={{
          sx: {
            fontWeight: 700,
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          },
        }}
      />

      <Box sx={{ position: "relative" }}>
        <Chart
          type="pie"
          series={chartSeries}
          options={chartOptions}
          width={{ xs: 240, xl: 260 }}
          height={{ xs: 240, xl: 260 }}
          sx={{ my: 9, mx: "auto" }}
        />
      </Box>

      <Divider sx={{ borderStyle: "dashed", borderColor: alpha(theme.palette.grey[500], 0.2) }} />

      <ChartLegends
        labels={chartOptions?.labels}
        colors={chartOptions?.colors}
        sx={{ p: 3, justifyContent: "center" }}
      />
    </Card>
  );
}
