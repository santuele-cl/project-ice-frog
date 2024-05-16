"use client";
import { Paper } from "@mui/material";
import { Fragment, Suspense, useEffect, useState } from "react";
import dayjs from "dayjs";
import ScheduleTable from "./_components/ScheduleTable";
import { Prisma } from "@prisma/client";
import { getEmployeesByDepartment } from "@/actions/users/users-action";
import { useSearchParams } from "next/navigation";
import { getWeek } from "@/app/_utils/days";

type UserWithProfileAndSchedules = Prisma.UserGetPayload<{
  include: { schedules: true; profile: true };
}>;

export default function SchedulesPage() {
  const searchParams = useSearchParams();
  const [employees, setEmployees] = useState<UserWithProfileAndSchedules[]>([]);

  const weekDates = getWeek(Number(searchParams.get("week")));

  useEffect(() => {
    const fetchEmployees = async () => {
      const response = await getEmployeesByDepartment();
      if (response.data) {
        setEmployees(response.data);
      } else {
        setEmployees([]);
      }
    };
    fetchEmployees();
  }, []);

  return (
    <Fragment>
      <Paper>
        {employees && employees.length > 0 && (
          <ScheduleTable
            employees={employees}
            week={Number(searchParams.get("week") ?? dayjs().week().toString())}
            weekDates={weekDates}
          />
        )}
      </Paper>
    </Fragment>
  );
}
