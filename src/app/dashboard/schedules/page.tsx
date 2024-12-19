import { Paper } from "@mui/material";
import { Fragment, Suspense } from "react";
import dayjs from "dayjs";
import ScheduleTable from "./_components/ScheduleTable";
import ScheduleTab from "./_components/ScheduleTab";

export default function AppointmentPage({
  searchParams: { week = dayjs().week().toString() },
}: {
  searchParams: {
    week?: string;
  };
}) {
  return (
    <Fragment>
      <Paper>
        <Suspense key={"schedules"} fallback={<h1>Loading</h1>}>
          <ScheduleTable week={week} />
        </Suspense>
      </Paper>
    </Fragment>
  );
}
