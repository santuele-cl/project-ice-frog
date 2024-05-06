"use client";
import { useState } from "react";
import { useSession } from "next-auth/react";

import { Box, Divider } from "@mui/material";

import UserSidebar from "../_ui/sidebar/UserSidebar";
import { SIDEBAR_LINKS } from "../_ui/sidebar/SidebarLinks";
import { CustomDrawer, CustomDrawerHeader } from "../_ui/CustomDrawer";
import CustomBreadcrumbs from "../_ui/CustomBreadcrumbs";
import CustomAppBar from "../_ui/CustomAppBar";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = useSession();
  const [open, setOpen] = useState(true);

  return (
    <Box sx={{ display: "flex" }}>
      <CustomAppBar setOpen={setOpen} open={open} />
      <CustomDrawer variant="permanent" open={open}>
        <CustomDrawerHeader />
        <Divider />
        <UserSidebar
          sidebarLinks={SIDEBAR_LINKS[session.data?.user.role!]}
          open={open}
        />
      </CustomDrawer>
      <Box
        component="main"
        sx={{ flexGrow: 1, p: 2, overflowX: "auto", position: "relative" }}
      >
        <CustomDrawerHeader />
        <CustomBreadcrumbs />
        {children}
      </Box>
    </Box>
  );
}
