import { Box, Button, Divider, Paper, Stack, Typography } from "@mui/material";
import Link from "next/link";
import EmployeeTableHeader from "./_components/EmployeeTableHeader";
import EmployeeTable from "./_components/EmployeeTable";
import EmployeeSearch from "./_components/EmployeeSearch";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";

export default async function page({
  searchParams: { name, page, department, occupation },
}: {
  searchParams: {
    name: string;
    occupation: string;
    page: string;
    department: string;
  };
}) {
  return (
    <Stack sx={{ gap: 2 }}>
      <Paper elevation={1} sx={{ p: 2 }}>
        <Box sx={{ mb: 2 }}>
          <Typography variant="h5" sx={{ fontWeight: "bold" }}>
            LIST OF EMPLOYEES
          </Typography>
        </Box>
        <EmployeeTableHeader>
          <EmployeeSearch />
          <Button
            LinkComponent={Link}
            href="/dashboard/employees/add"
            variant="contained"
            startIcon={<AddOutlinedIcon />}
          >
            Add employee
          </Button>
        </EmployeeTableHeader>
      </Paper>
      <Paper elevation={1} sx={{ p: 2 }}>
        <EmployeeTable
          occupation={occupation}
          name={name}
          page={Number(page)}
          department={department}
        />
      </Paper>
    </Stack>
  );
}
