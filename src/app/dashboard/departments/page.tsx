import TableSkeleton from "@/app/_ui/TableSkeleton";
import { Box, Divider, Paper, Stack, Typography } from "@mui/material";
import { Suspense } from "react";
import DepartmentTable from "./_components/DepartmentTable";
import DepartmentTableHeader from "./_components/DepartmentTableHeader";
import DepartmentSearch from "./_components/DepartmentSearch";
import DepartmentAddFormModal from "./_components/DepartmentAddFormModal";

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
        <Box sx={{ mb: 2 }}>
          <Typography variant="h5" sx={{ fontWeight: "bold" }}>
            LIST OF DEPARTMENTS
          </Typography>
        </Box>
        <DepartmentTableHeader>
          <DepartmentSearch />
          <DepartmentAddFormModal />
        </DepartmentTableHeader>
      </Paper>
      <Paper elevation={1} sx={{ p: 2 }}>
        <Divider sx={{ my: 1 }} />
        <Suspense fallback={<TableSkeleton />}>
          <DepartmentTable
            email={email}
            page={Number(page)}
            department={department}
            status={status}
          />
        </Suspense>

        <Divider sx={{ my: 1 }} />
        {/* <EmployeeTablePagination /> */}
      </Paper>
    </Stack>
  );
}
