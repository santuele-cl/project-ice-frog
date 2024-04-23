import { Button, Divider, Paper, Stack, Typography } from "@mui/material";
import React, { Suspense } from "react";
// import { Patient, User } from "@prisma/client";
import Link from "next/link";
import PersonAddAltOutlinedIcon from "@mui/icons-material/PersonAddAltOutlined";

import TableSkeleton from "@/app/_ui/TableSkeleton";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import ArchivedEmployeeTableHeader from "./_components/ArchivedEmployeeTableHeader";
import ArchivedEmployeeSearch from "./_components/ArchivedEmployeeSearch";
import ArchivedEmployeeTable from "./_components/ArchivedEmployeeTable";
import ArchivedEmployeeTablePagination from "./_components/ArchivedEmployeeTablePagination";


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
      <Typography variant="h5">List of Archived Employees</Typography>
      <Paper elevation={1} sx={{ p: 2 }}>
     {/* <ArchivedEmployeeTableHeader>
          <ArchivedEmployeeSearch />
          <ArchivedEmployeeAddFormModal /> 
       
        </ArchivedEmployeeTableHeader>`
        <Divider sx={{ my: 1 }} /> */}
        <Suspense fallback={<TableSkeleton />}>
          <ArchivedEmployeeTable
            email={email}
            page={Number(page)}
            department={department}
            status={status}
          />
        </Suspense>
        <Divider sx={{ my: 1 }} />
        <ArchivedEmployeeTablePagination />
      </Paper>
    </Stack>
  );
}
