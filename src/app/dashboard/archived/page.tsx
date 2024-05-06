import { Box, Paper, Stack, Typography } from "@mui/material";
import React, { Suspense } from "react";

import TableSkeleton from "@/app/_ui/TableSkeleton";
import ArchivedEmployeeTable from "./_components/ArchivedEmployeeTable";

export default async function page({
  searchParams: { email, page, department, status },
}: {
  searchParams: {
    email: string;
    page: string;
    department: string;
    status: string;
  };
}) {
  return (
    <Stack sx={{ gap: 2 }}>
      <Paper elevation={1} sx={{ p: 2 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: "bold" }}>
            LIST OF ARCHIVED EMPLOYEES
          </Typography>
        </Box>
      </Paper>

      <Paper elevation={1} sx={{ p: 2 }}>
        <Suspense fallback={<TableSkeleton />}>
          <ArchivedEmployeeTable
            email={email}
            page={Number(page)}
            department={department}
            status={status}
          />
        </Suspense>
      </Paper>
    </Stack>
  );
}
