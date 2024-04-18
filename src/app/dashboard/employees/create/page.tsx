import { Breadcrumbs, Divider, Paper, Stack, Typography } from "@mui/material";
import EmployeeAddForm from "../_components/EmployeeAddForm";
import Link from "next/link";

export default function EmployeeCreatePage() {
  return (
    <Paper
      elevation={1}
      sx={{
        p: 3,
      }}
    >
      <Stack sx={{ gap: 2 }}>
        <Typography variant="h6">Add Employee Form</Typography>
        <Divider />
        <EmployeeAddForm />
      </Stack>
    </Paper>
  );
}
