import { Paper, Typography } from "@mui/material";
import { Fragment, Suspense } from "react";
import dayjs from "dayjs";
import ScheduleTable from "./_components/ScheduleTable";
import Search from "@mui/icons-material/Search";

export default function AppointmentPage({
  searchParams: { week, department },
}: {
  searchParams: {
    week?: string;
    department?: string;
  };
}) {
  if (week) {
    if (isNaN(Number(week))) {
      return (
        <Paper>
          <Typography>Invalid week input</Typography>
        </Paper>
      );
    }
  }
  return (
    <Fragment>
      <Paper>
        <Suspense key={"schedules"} fallback={<h1>Loading</h1>}>
          <ScheduleTable
            week={week ? week : dayjs().week().toString()}
            department={department}
          />
        </Suspense>
      </Paper>
    </Fragment>
  );
}
