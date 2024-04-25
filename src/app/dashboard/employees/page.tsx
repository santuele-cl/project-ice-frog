import { Button, Divider, Paper, Stack, Typography } from "@mui/material";
import React, { Suspense } from "react";
// import { Patient, User } from "@prisma/client";
import Link from "next/link";
import PersonAddAltOutlinedIcon from "@mui/icons-material/PersonAddAltOutlined";
import EmployeeTableHeader from "./_components/EmployeeTableHeader";
import EmployeeTable from "./_components/EmployeeTable";
import EmployeeTablePagination from "./_components/EmployeeTablePagination";
import EmployeeSearch from "./_components/EmployeeSearch";
import TableSkeleton from "@/app/_ui/TableSkeleton";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";

export default async function page({
  searchParams: { name, page, department, status, occupation },
}: {
  searchParams: {
    name: string;
    occupation: string;
    page: string;
    department: string;
    status: string;
  };
}) {
  return (
    <Stack sx={{ gap: 2 }}>
      <Typography variant="h5">List of Employees</Typography>
      <Paper elevation={1} sx={{ p: 2 }}>
        <EmployeeTableHeader>
          <EmployeeSearch />
          {/* <EmployeeAddFormModal /> */}
          <Button
            LinkComponent={Link}
            href="/dashboard/employees/add"
            variant="contained"
            startIcon={<AddOutlinedIcon />}
            // onClick={() => setShow(true)}
          >
            Add employee
          </Button>
        </EmployeeTableHeader>
        <Divider sx={{ my: 1 }} />
        <Suspense fallback={<TableSkeleton />}>
          <EmployeeTable
            occupation={occupation}
            name={name}
            page={Number(page)}
            department={department}
            status={status}
          />
        </Suspense>
        <Divider sx={{ my: 1 }} />
        <EmployeeTablePagination />
      </Paper>
    </Stack>
  );
}
