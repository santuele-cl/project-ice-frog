import { getEmployeeById } from "@/actions/users/users-action";
import ErrorComponent from "@/app/_ui/ErrorComponent";
import {
  Avatar,
  Divider,
  Paper,
  Stack,
  SxProps,
  Typography,
  Box,
  Button,
} from "@mui/material";
import EmployeeScheduleTableHeader from "./_components/EmployeeScheduleTableHeader";
import EmployeeScheduleSearch from "./_components/EmployeeScheduleSearch";
import EmployeeScheduleAddFormModal from "./_components/EmployeeScheduleAddFormModal";
import EmployeeSchedulesTable from "./_components/EmployeeSchedulesTable";
import { Suspense } from "react";
import TableSkeleton from "@/app/_ui/TableSkeleton";
import EmployeeDetails from "../../schedules/_components/EmployeeDetails";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import TablePagination from "@/app/_ui/TablePagination";

export default async function EmployeeDetailsPage({
  params: { id },
}: {
  params: { id: string };
}) {
  const employee = await getEmployeeById(id);

  // const handleExport = async () => {
  //   const employees = await findUser({
  //     page: 0,
  //     ...(name && { name }),
  //     ...(occupation && { occupation }),
  //     ...(page && { page }),
  //     ...(department && { department }),
  //   });

  //   if (employees.success && employees.data) {
  //     const flattenedEmployees = employees.data.map((employee) =>
  //       flattenObject(employee)
  //     );

  //     const wb = XLSX.utils.book_new();
  //     const ws = XLSX.utils.json_to_sheet(flattenedEmployees);

  //     XLSX.utils.book_append_sheet(wb, ws, "sheet 1");
  //     XLSX.writeFile(wb, "book.xlsx");
  //   }
  // };

  if (employee.error || !employee.data)
    return (
      <Paper
        elevation={1}
        sx={{ p: 2, position: "relative", height: "100%", weight: "100%" }}
      >
        <ErrorComponent errMessage={String(employee.error)} />
      </Paper>
    );

  const { id: employeeId } = employee.data;

  return (
    <Stack sx={{ gap: 2 }}>
      <Paper elevation={1} sx={{ p: 2 }}>
        {employee.data && <EmployeeDetails details={employee.data} />}
      </Paper>
      <Paper elevation={1} sx={{ p: 2 }}>
        <EmployeeScheduleTableHeader>
          <EmployeeScheduleSearch />
          <EmployeeScheduleAddFormModal />
        </EmployeeScheduleTableHeader>
        <Divider sx={{ my: 1 }} />
        <Stack
          sx={{ my: 1, flexDirection: "row", justifyContent: "space-between" }}
        >
          <TablePagination
            pagination={{ totalCount: 0, totalPages: 0, itemsPerPage: 0 }}
          />
          <Button
            startIcon={<FileDownloadIcon />}
            variant="outlined"
            color="success"
            // onClick={handleExport}
          >
            Export
          </Button>
        </Stack>
        <Divider sx={{ my: 1 }} />
        <Suspense fallback={<TableSkeleton />}>
          <EmployeeSchedulesTable employeeId={employeeId} />
        </Suspense>
      </Paper>
    </Stack>
  );
}
