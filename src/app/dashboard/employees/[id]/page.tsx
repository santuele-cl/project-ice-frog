import { getEmployeeById } from "@/actions/users/users-action";
import ErrorComponent from "@/app/_ui/ErrorComponent";
import { Paper } from "@mui/material";

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

  return <pre>{JSON.stringify(employee.data, null, 2)}</pre>;
}
