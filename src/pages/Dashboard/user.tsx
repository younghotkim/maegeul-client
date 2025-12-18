import React from "react";
import { DashboardLayout } from "../../layouts/dashboard";
import { UserView } from "../../sections/user/view";
import { CONFIG } from "../../config-global";
import { Helmet } from "react-helmet-async";

const User: React.FC = () => {
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
        <UserView />
      </DashboardLayout>
    </>
  );
};

export default User;
