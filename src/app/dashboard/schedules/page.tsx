"use client";
import { Paper } from "@mui/material";
import { Fragment } from "react";
import ScheduleTable from "./_components/ScheduleTable";

export default function SchedulesPage() {
  return (
    <Fragment>
      <Paper>
        <ScheduleTable />
      </Paper>
    </Fragment>
  );
}
