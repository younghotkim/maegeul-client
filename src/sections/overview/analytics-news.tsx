import type { BoxProps } from "@mui/material/Box";
import type { CardProps } from "@mui/material/Card";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";
import CardHeader from "@mui/material/CardHeader";
import ListItemText from "@mui/material/ListItemText";
import { alpha, useTheme } from "@mui/material/styles";

import { fToNow } from "../../utils/format-time";

import { Iconify } from "../../dashboardComponents/iconify";
import { Scrollbar } from "../../dashboardComponents/scrollbar";

import type { PostItemProps } from "../blog/post-item";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

// ----------------------------------------------------------------------

type Props = CardProps & {
  title?: string;
  subheader?: string;
  list: PostItemProps[];
};

export function AnalyticsNews({ title, subheader, list, ...other }: Props) {
  const theme = useTheme();

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
        sx={{ mb: 1 }}
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

      <Scrollbar sx={{ minHeight: 200 }}>
        <Box sx={{ minWidth: 640 }}>
          {list.map((post, index) => (
            <PostItem key={post.id} item={post} index={index} />
          ))}
        </Box>
      </Scrollbar>

      <Box sx={{ p: 2, textAlign: "right" }}>
        <Link to="/contents">
          <Button
            size="small"
            sx={{
              color: "#667eea",
              fontWeight: 600,
              "&:hover": {
                backgroundColor: alpha("#667eea", 0.08),
              },
            }}
            endIcon={<ArrowRight size={16} />}
          >
            모두 보기
          </Button>
        </Link>
      </Box>
    </Card>
  );
}

// ----------------------------------------------------------------------

function PostItem({
  sx,
  item,
  index,
  ...other
}: BoxProps & { item: Props["list"][number]; index: number }) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        py: 2.5,
        px: 3,
        gap: 2,
        display: "flex",
        alignItems: "center",
        borderBottom: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
        transition: "all 0.2s ease",
        "&:hover": {
          backgroundColor: alpha(theme.palette.primary.main, 0.04),
        },
        ...sx,
      }}
      {...other}
    >
      <Avatar
        variant="rounded"
        alt={item.title}
        src={item.coverUrl}
        sx={{
          width: 56,
          height: 56,
          flexShrink: 0,
          borderRadius: 2,
          boxShadow: `0 4px 12px ${alpha(theme.palette.grey[500], 0.16)}`,
        }}
      />

      <ListItemText
        primary={item.title}
        secondary={item.description}
        primaryTypographyProps={{
          noWrap: true,
          typography: "subtitle2",
          fontWeight: 600,
        }}
        secondaryTypographyProps={{
          mt: 0.5,
          noWrap: true,
          component: "span",
          color: "text.secondary",
        }}
      />

      <Box
        sx={{
          flexShrink: 0,
          color: "text.disabled",
          typography: "caption",
          px: 1.5,
          py: 0.5,
          borderRadius: 1,
          backgroundColor: alpha(theme.palette.grey[500], 0.08),
        }}
      >
        {fToNow(item.postedAt)}
      </Box>
    </Box>
  );
}
