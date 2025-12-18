import type { CardProps } from "@mui/material/Card";
import type { ChartOptions } from "../../dashboardComponents/chart";

import Card from "@mui/material/Card";
import Divider from "@mui/material/Divider";
import { useTheme } from "@mui/material/styles";
import CardHeader from "@mui/material/CardHeader";

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

  const chartColors = chart.colors ?? [
    "#6AD2FF", // 원하는 색상 (예: 파란색)
    "#FFDE57", // 원하는 색상 (예: 노란색)
    "#35D28A", // 원하는 색상 (예: 초록색)
    "#EE5D50", // 원하는 색상 (예: 빨간색)
  ];

  const chartOptions = useChart({
    chart: { sparkline: { enabled: true } },
    colors: chartColors,
    labels: chart.series.map((item) => item.label),
    stroke: { width: 0 },
    dataLabels: { enabled: true, dropShadow: { enabled: false } },
    tooltip: {
      y: {
        formatter: (value: number) => fNumber(value),
        title: { formatter: (seriesName: string) => `${seriesName}` },
      },
    },
    plotOptions: { pie: { donut: { labels: { show: false } } } },
    ...chart.options,
  });

  return (
    <Card {...other}>
      <CardHeader title={title} subheader={subheader} />

      <Chart
        type="pie"
        series={chartSeries}
        options={chartOptions}
        width={{ xs: 240, xl: 260 }}
        height={{ xs: 240, xl: 260 }}
        sx={{ my: 6, mx: "auto" }}
      />

      <Divider sx={{ borderStyle: "dashed" }} />

      <ChartLegends
        labels={chartOptions?.labels}
        colors={chartOptions?.colors}
        sx={{ p: 3, justifyContent: "center" }}
      />
    </Card>
  );
}
