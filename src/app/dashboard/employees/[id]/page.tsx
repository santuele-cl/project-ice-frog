import { getEmployeeById } from "@/actions/users/users-action";
import ErrorComponent from "@/app/_ui/ErrorComponent";
import {
  Avatar,
  Divider,
  Paper,
  Stack,
  SxProps,
  Typography,
} from "@mui/material";
import EmployeeScheduleTableHeader from "./_components/EmployeeScheduleTableHeader";
import EmployeeScheduleSearch from "./_components/EmployeeScheduleSearch";
import EmployeeScheduleAddFormModal from "./_components/EmployeeScheduleAddFormModal";
import EmployeeSchedulesTable from "./_components/EmployeeSchedulesTable";
import { Suspense } from "react";
import TableSkeleton from "@/app/_ui/TableSkeleton";
import EmployeeDetails from "../../schedules/_components/EmployeeDetails";

export default async function EmployeeDetailsPage({
  params: { id },
}: {
  params: { id: string };
}) {
  const employee = await getEmployeeById(id);

  if (employee.error || !employee.data)
    return (
      <Paper
        elevation={1}
        sx={{ p: 2, position: "relative", height: "100%", weight: "100%" }}
      >
        <ErrorComponent errMessage={String(employee.error)} />
      </Paper>
    );

  const {
    profile,
    schedules,
    id: employeeId,
    role,
    email,
    isActive,
    emailVerified,
    createdAt,
  } = employee.data;

  return (
    <Stack sx={{ gap: 2 }}>
      <Paper elevation={1} sx={{ p: 2 }}>
        {profile && <EmployeeDetails profile={profile} />}
      </Paper>
      <Paper elevation={1} sx={{ p: 2 }}>
        <EmployeeScheduleTableHeader>
          <EmployeeScheduleSearch />
          <EmployeeScheduleAddFormModal />
        </EmployeeScheduleTableHeader>
        <Divider sx={{ my: 1 }} />
        <Suspense fallback={<TableSkeleton />}>
          <EmployeeSchedulesTable employeeId={employeeId} />
        </Suspense>
      </Paper>
    </Stack>
  );
}
