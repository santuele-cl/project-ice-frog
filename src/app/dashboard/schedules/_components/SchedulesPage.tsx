import { Paper } from "@mui/material";
import ScheduleTable from "./ScheduleTable";
import { getUser } from "@/actions/users/users-action";

export default async function SchedulesPage() {
  const users = await getUser("TECHNOLOGY");

  return (
    <Paper>
      <pre> {JSON.stringify(users.data, null, 2)}</pre>
      <ScheduleTable />
    </Paper>
  );
}
