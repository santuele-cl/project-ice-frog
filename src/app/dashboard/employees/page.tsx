import { findUser } from "@/actions/users/users";
// import Search from "../../users/_components/Search";

import FindInPageOutlinedIcon from "@mui/icons-material/FindInPageOutlined";
import {
  Box,
  Button,
  Divider,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import React, { FormEvent, Suspense, useEffect, useState } from "react";
import { findPatient, getTotalPatientsCount } from "@/actions/patients";
// import { Patient, User } from "@prisma/client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import HomeOutlined from "@mui/icons-material/HomeOutlined";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import PersonAddAltOutlinedIcon from "@mui/icons-material/PersonAddAltOutlined";
import EmployeeTableHeader from "./_components/EmployeeTableHeader";
import EmployeeTable from "./_components/EmployeeTable";
import EmployeeTablePagination from "./_components/EmployeeTablePagination";
import EmployeeAdd from "./_components/EmployeeAdd";
import EmployeeSearch from "./_components/EmployeeSearch";
import TableSkeleton from "@/app/_ui/TableSkeleton";

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
    <Paper elevation={1} sx={{ p: 2 }}>
      <EmployeeTableHeader>
        <EmployeeSearch />
        <EmployeeAdd />
      </EmployeeTableHeader>
      <Divider sx={{ my: 1 }} />
      <Suspense fallback={<TableSkeleton />}>
        <EmployeeTable
          email={email}
          page={Number(page)}
          department={department}
          status={status}
        />
      </Suspense>

      <Divider sx={{ my: 1 }} />
      <EmployeeTablePagination />
    </Paper>
  );
}
