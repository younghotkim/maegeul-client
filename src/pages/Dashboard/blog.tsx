import React from "react";
import { DashboardLayout } from "../../layouts/dashboard";
import { BlogView } from "../../sections/blog/view";
import { CONFIG } from "../../config-global";
import { Helmet } from "react-helmet-async";

const Blog: React.FC = () => {
  return (
    <>
      <Helmet>
        <title> {`${CONFIG.appName}`}</title>
        <meta
          name="description"
          content="The starting point for your next project with Minimal UI Kit, built on the newest version of Material-UI ©, ready to be customized to your style"
        />
        <meta
          name="keywords"
          content="react,material,kit,application,dashboard,admin,template"
        />
      </Helmet>
      <DashboardLayout>
        <BlogView />
      </DashboardLayout>
    </>
  );
};

export default Blog;
