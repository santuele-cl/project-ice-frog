import { Paper } from "@mui/material";
import ScheduleTable from "./ScheduleTable";
import { Suspense } from "react";
import dayjs from "dayjs";

export default function SchedulesPage({
  searchParams: { week = dayjs().week().toString() },
}: {
  searchParams: {
    week?: string;
  };
}) {
  return (
    <Paper>
      <Suspense key={"schedules"} fallback={<h1>Loading</h1>}>
        <ScheduleTable week={week} />
      </Suspense>
    </Paper>
  );
}
