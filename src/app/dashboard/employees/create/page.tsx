import { Breadcrumbs, Stack, Typography } from "@mui/material";
import EmployeeAddForm from "../_components/EmployeeAddForm";
import Link from "next/link";

export default function EmployeeCreatePage() {
  return (
    <Stack sx={{ gap: 2 }}>
      <EmployeeAddForm />
    </Stack>
  );
}
