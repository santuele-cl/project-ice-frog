import { Button, Divider, Paper, Box, Typography, Stack } from "@mui/material";
import React, { FormEvent, Suspense } from "react";
import Link from "next/link";
import TableSkeleton from "@/app/_ui/TableSkeleton";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import { auth } from "@/auth";
import ProjectsSearch from "../projects/_components/ProjectsSearch";
import ProjectSchedulesTableHeader from "../projects/[id]/_components/ProjectSchedulesTableHeader";
import MyProjectsTable from "./_component/MyProjectsTable";

export default async function page({
  searchParams: { jobOrder, page, name, location },
}: {
  searchParams: {
    jobOrder: string;
    page: string;
    name: string;
    location: string;
  };
}) {
  const session = await auth();
  console.log("sess : ", session);

  return (
    <Stack sx={{ gap: 2 }}>
      <Box>
        <Typography variant="h5">My Projects</Typography>
      </Box>
      <Paper elevation={1} sx={{ p: 2 }}>
        <ProjectSchedulesTableHeader>
          <ProjectsSearch />
        </ProjectSchedulesTableHeader>
        <Divider sx={{ my: 1 }} />
        <MyProjectsTable
          employeeId={session?.user.id!}
          name={name}
          page={Number(page)}
          location={location}
          jobOrder={jobOrder}
        />
      </Paper>
    </Stack>
  );
}
