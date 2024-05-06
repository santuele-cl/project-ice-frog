import { Button, Divider, Paper, Box, Typography, Stack } from "@mui/material";
import React, { FormEvent, Suspense } from "react";
import Link from "next/link";
import ProjectsTableHeader from "./_components/ProjectsTableHeader";
import ProjectsTable from "./_components/ProjectsTable";
import ProjectsTablePagination from "./_components/ProjectsTablePagination";
import ProjectsSearch from "./_components/ProjectsSearch";
import TableSkeleton from "@/app/_ui/TableSkeleton";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import { auth } from "@/auth";
import AdminProjectsTable from "./_components/AdminProjectsTable";

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

  return (
    <Stack sx={{ gap: 2 }}>
      <Paper elevation={1} sx={{ p: 2 }}>
        <Box sx={{ mb: 2 }}>
          <Typography variant="h5" sx={{ fontWeight: "bold" }}>
            LIST OF PROJECTS
          </Typography>
        </Box>
        <ProjectsTableHeader>
          <ProjectsSearch />
          <Button
            LinkComponent={Link}
            href="/dashboard/projects/add"
            variant="contained"
            startIcon={<AddOutlinedIcon />}
          >
            Add Project
          </Button>
        </ProjectsTableHeader>
      </Paper>

      <Paper elevation={1} sx={{ p: 2 }}>
        <AdminProjectsTable
          name={name}
          page={Number(page)}
          location={location}
          jobOrder={jobOrder}
        />
      </Paper>
    </Stack>
  );
}
