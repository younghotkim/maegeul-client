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
import { alpha, useTheme } from "@mui/material/styles";

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
  const theme = useTheme();

  return (
    <Card
      {...other}
      sx={{
        height: { xs: "350px", sm: "380px", md: "400px" },
        display: "flex",
        flexDirection: "column",
        width: "100%",
        borderRadius: 3,
        boxShadow: `0 4px 20px ${alpha(theme.palette.grey[500], 0.12)}`,
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        "&:hover": {
          boxShadow: `0 8px 24px ${alpha(theme.palette.grey[500], 0.16)}`,
        },
      }}
    >
      <CardHeader
        title={title}
        subheader={subheader}
        sx={{
          px: { xs: 2, sm: 3 },
          py: { xs: 1.5, sm: 2 },
        }}
        titleTypographyProps={{
          sx: {
            fontWeight: 700,
            fontSize: { xs: "1rem", sm: "1.25rem", md: "1.5rem" },
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
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
        {list.slice(0, 4).map((item, index) => (
          <Item
            key={item.id}
            item={item}
            lastItem={index === Math.min(list.length, 4) - 1}
            index={index}
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
  index: number;
};

function Item({ item, lastItem, index, ...other }: ItemProps) {
  const theme = useTheme();

  return (
    <TimelineItem
      {...other}
      sx={{
        "&:hover": {
          "& .timeline-content": {
            backgroundColor: alpha(theme.palette.primary.main, 0.04),
            borderRadius: 1,
          },
        },
      }}
    >
      <TimelineSeparator>
        <TimelineDot
          sx={{
            backgroundColor: item.type,
            width: { xs: 16, sm: 18, md: 20 },
            height: { xs: 16, sm: 18, md: 20 },
            boxShadow: `0 4px 12px ${alpha(item.type, 0.4)}`,
            border: `2px solid ${alpha("#fff", 0.8)}`,
          }}
        />
        {lastItem ? null : (
          <TimelineConnector
            sx={{
              background: `linear-gradient(180deg, ${item.type} 0%, ${alpha(
                theme.palette.grey[300],
                0.5
              )} 100%)`,
            }}
          />
        )}
      </TimelineSeparator>

      <TimelineContent
        className="timeline-content"
        sx={{
          px: { xs: 1.5, sm: 2 },
          py: { xs: 0.75, sm: 1 },
          transition: "all 0.2s ease",
        }}
      >
        <Typography
          variant="subtitle2"
          sx={{
            fontSize: { xs: "0.875rem", sm: "0.9375rem", md: "1rem" },
            lineHeight: { xs: 1.4, sm: 1.5 },
            wordBreak: "break-word",
            fontWeight: 600,
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
