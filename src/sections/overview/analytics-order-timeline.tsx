import type { CardProps } from "@mui/material/Card";
import type { TimelineItemProps } from "@mui/lab/TimelineItem";

import Card from "@mui/material/Card";
import Timeline from "@mui/lab/Timeline";
import TimelineDot from "@mui/lab/TimelineDot";
import Typography from "@mui/material/Typography";
import CardHeader from "@mui/material/CardHeader";
import TimelineContent from "@mui/lab/TimelineContent";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineItem, { timelineItemClasses } from "@mui/lab/TimelineItem";

// ----------------------------------------------------------------------

type Props = CardProps & {
  title?: string;
  subheader?: string;
  list: {
    id: string;
    type: string;
    title: string;
    time: string | number | null;
  }[];
};

export function AnalyticsOrderTimeline({
  title,
  subheader,
  list,
  ...other
}: Props) {
  return (
    <Card
      {...other}
      sx={{
        height: { xs: "350px", sm: "380px", md: "400px" }, // 반응형 높이
        display: "flex",
        flexDirection: "column",
        width: "100%",
      }}
    >
      <CardHeader
        title={title}
        subheader={subheader}
        sx={{
          px: { xs: 2, sm: 3 },
          py: { xs: 1.5, sm: 2 },
          "& .MuiCardHeader-title": {
            fontSize: { xs: "1rem", sm: "1.25rem", md: "1.5rem" },
          },
          "& .MuiCardHeader-subheader": {
            fontSize: { xs: "0.75rem", sm: "0.875rem" },
          },
        }}
      />

      <Timeline
        sx={{
          m: 0,
          p: { xs: 2, sm: 2.5, md: 3 },
          flexGrow: 1,
          overflowY: "auto",
          [`& .${timelineItemClasses.root}:before`]: {
            flex: 0,
            padding: 0,
          },
        }}
      >
        {/* list의 처음 5개의 항목만 가져옴 */}
        {list.slice(0, 4).map((item, index) => (
          <Item
            key={item.id}
            item={item}
            lastItem={index === list.length - 1}
          />
        ))}
      </Timeline>
    </Card>
  );
}

// ----------------------------------------------------------------------

type ItemProps = TimelineItemProps & {
  lastItem: boolean;
  item: Props["list"][number];
};

function Item({ item, lastItem, ...other }: ItemProps) {
  return (
    <TimelineItem {...other}>
      <TimelineSeparator>
        {/* item.type에 저장된 색상 코드를 사용하여 동적 스타일링 */}
        <TimelineDot
          sx={{
            backgroundColor: item.type,
            width: { xs: 32, sm: 36, md: 40 },
            height: { xs: 32, sm: 36, md: 40 },
          }}
        />
        {lastItem ? null : <TimelineConnector />}
      </TimelineSeparator>

      <TimelineContent
        sx={{
          px: { xs: 1.5, sm: 2 },
          py: { xs: 0.5, sm: 1 },
        }}
      >
        <Typography
          variant="subtitle2"
          sx={{
            fontSize: { xs: "0.875rem", sm: "0.9375rem", md: "1rem" },
            lineHeight: { xs: 1.4, sm: 1.5 },
            wordBreak: "break-word",
          }}
        >
          {item.title}
        </Typography>

        <Typography
          variant="caption"
          sx={{
            color: "text.disabled",
            fontSize: { xs: "0.75rem", sm: "0.8125rem" },
            display: "block",
            mt: { xs: 0.5, sm: 0.75 },
          }}
        >
          {item.time}
        </Typography>
      </TimelineContent>
    </TimelineItem>
  );
}
