import type { BoxProps } from "@mui/material/Box";

import ApexChart from "react-apexcharts";

import Box from "@mui/material/Box";

import { chartClasses } from "./classes";

import type { ChartProps } from "./types";

// ----------------------------------------------------------------------

export function Chart({
  sx,
  type,
  series,
  height,
  options,
  className,
  width = "100%",
  ...other
}: BoxProps & ChartProps) {
  // 반응형 높이 설정 (height가 제공되지 않은 경우)
  const responsiveHeight =
    height ||
    ({
      xs: "250px",
      sm: "300px",
      md: "350px",
      lg: "400px",
    } as const);

  // width가 반응형 객체인지 확인하고 적절히 처리
  const responsiveWidth =
    typeof width === "string" || typeof width === "number"
      ? { xs: "100%", sm: width }
      : { xs: "100%", ...width };

  return (
    <Box
      dir="ltr"
      className={chartClasses.root.concat(className ? ` ${className}` : "")}
      sx={{
        width: responsiveWidth,
        height:
          typeof height === "string" || typeof height === "number"
            ? height
            : responsiveHeight,
        minHeight: { xs: "200px", sm: "250px" },
        flexShrink: 0,
        borderRadius: { xs: 1, sm: 1.5 },
        position: "relative",
        overflow: "hidden",
        ...sx,
      }}
      {...other}
    >
      <ApexChart
        type={type}
        series={series}
        options={options}
        width="100%"
        height="100%"
      />
    </Box>
  );
}
