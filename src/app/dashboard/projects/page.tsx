import { Button, Divider, Paper, Box, Typography, Stack } from "@mui/material";
import React, { FormEvent, Suspense } from "react";
import Link from "next/link";
import ProjectsTableHeader from "./_components/ProjectsTableHeader";
import ProjectsTable from "./_components/ProjectsTable";
import ProjectsTablePagination from "./_components/ProjectsTablePagination";
import ProjectsSearch from "./_components/ProjectsSearch";
import TableSkeleton from "@/app/_ui/TableSkeleton";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";

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
  return (
    <Stack sx={{ gap: 2 }}>
      <Box>
        <Typography variant="h5">List of Projects</Typography>
      </Box>
      <Paper elevation={1} sx={{ p: 2 }}>
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
        <Divider sx={{ my: 1 }} />
        <Suspense fallback={<TableSkeleton />}>
          <ProjectsTable
            name={name}
            page={Number(page)}
            location={location}
            jobOrder={jobOrder}
          />
        </Suspense>

        <Divider sx={{ my: 1 }} />
        <ProjectsTablePagination />
      </Paper>
    </Stack>
  );
}
