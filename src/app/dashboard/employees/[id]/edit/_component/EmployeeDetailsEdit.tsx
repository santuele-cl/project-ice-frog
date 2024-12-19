import { getCompleteEmployeeDetailsById } from "@/actions/users/users-action";
import ErrorComponent from "@/app/_ui/ErrorComponent";
import { Paper } from "@mui/material";
import EmployeeDetailsEditForm from "./EmployeeDetailsEditForm";
import { Prisma } from "@prisma/client";

type UserWithOtherDetails = Prisma.UserGetPayload<{
  include: {
    profile: { include: { department: true } };
    schedules: { include: { project: true } };
  };
}>;

export default async function EmployeeDetailsEdit({ id }: { id: string }) {
  const employee = await getCompleteEmployeeDetailsById(id);

  if (employee.error || !employee.data)
    return (
      <Paper
        elevation={1}
        sx={{ p: 2, position: "relative", height: "100%", weight: "100%" }}
      >
        <ErrorComponent errMessage={String(employee.error)} />
      </Paper>
    );

  return (
    <EmployeeDetailsEditForm user={employee.data as UserWithOtherDetails} />
  );
}
