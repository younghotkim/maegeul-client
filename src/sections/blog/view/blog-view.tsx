import { useState, useCallback } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Pagination from "@mui/material/Pagination";

import { _posts } from "../../../_mock";
import { DashboardContent } from "../../../layouts/dashboard";

import { Iconify } from "../../../dashboardComponents/iconify";

import { PostItem } from "../post-item";
import { PostSort } from "../post-sort";
import { PostSearch } from "../post-search";
import { useAuthStore } from "../../../hooks/stores/use-auth-store";

// ----------------------------------------------------------------------

export function BlogView() {
  const [sortBy, setSortBy] = useState("latest");

  const handleSort = useCallback((newSort: string) => {
    setSortBy(newSort);
  }, []);

  const user = useAuthStore((state) => state.user);

  return (
    <DashboardContent>
      <Box display="flex" alignItems="center" mb={5}>
        <Typography variant="h4" flexGrow={1}>
          {user?.profile_name}님을 위한 추천 컨텐츠 🎵
        </Typography>
        <Button
          variant="contained"
          color="inherit"
          startIcon={<Iconify icon="mingcute:add-line" />}
        >
          New post
        </Button>
      </Box>

      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        sx={{ mb: 5 }}
      >
        <PostSearch posts={_posts} />
        <PostSort
          sortBy={sortBy}
          onSort={handleSort}
          options={[
            { value: "latest", label: "Latest" },
            { value: "popular", label: "Popular" },
            { value: "oldest", label: "Oldest" },
          ]}
        />
      </Box>

      <Grid container spacing={3}>
        {_posts.map((post, index) => {
          const latestPostLarge = index === 0;
          const latestPost = index === 1 || index === 2;

          return (
            <Grid
              key={post.id}
              xs={12}
              sm={latestPostLarge ? 12 : 6}
              md={latestPostLarge ? 6 : 3}
              container
              item
            >
              <PostItem
                post={post}
                latestPost={latestPost}
                latestPostLarge={latestPostLarge}
              />
            </Grid>
          );
        })}
      </Grid>

      <Pagination count={10} color="primary" sx={{ mt: 8, mx: "auto" }} />
    </DashboardContent>
  );
}
