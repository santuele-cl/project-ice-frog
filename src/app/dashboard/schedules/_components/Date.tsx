"use client";
import { getSchedulesByDate } from "@/actions/schedules/schedule-action";
import { IconButton, Stack, Typography } from "@mui/material";
import dayjs from "dayjs";
import EventBusyIcon from "@mui/icons-material/EventBusy";
import AddIcon from "@mui/icons-material/Add";
import AddScheduleFormModal from "./AddScheduleFormModal";
import { useEffect, useState } from "react";
import { Prisma } from "@prisma/client";

interface DateProps {
  employeeId: string;
  endDate: Date;
  startDate: Date;
}

type UserWithProject = Prisma.ScheduleGetPayload<{
  include: { project: true };
}>;

export default function Date({ employeeId, startDate, endDate }: DateProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [schedules, setSchedules] = useState<UserWithProject[]>([]);

  useEffect(() => {
    const fetchEmployees = async () => {
      const response = await getSchedulesByDate(employeeId, startDate, endDate);
      if (response && response.data && response.data.length > 0) {
        setSchedules(response.data);
        console.log(schedules);
      } else {
        setSchedules([]);
      }
      setIsLoading(false);
    };
    fetchEmployees();
  }, [employeeId, startDate, endDate]);

  if (isLoading) {
    return (
      <Stack sx={{ justifyContent: "center", alignItems: "center" }}>
        <Typography>Loading...</Typography>
      </Stack>
    );
  }

  return (
    <Stack sx={{ justifyContent: "center", alignItems: "center" }}>
      {(!schedules || schedules.length < 1) && <AddScheduleFormModal />}
      {schedules &&
        schedules.length > 0 &&
        schedules.map((schedule) => {
          return (
            <Stack
              sx={{
                p: 2,
                minHeight: 100,
                minWidth: 210,
                bgcolor: "rgba(255, 255, 0, 0.4)",
                borderRadius: 2,
                marginBottom: "5px",
                fontSize: "0.8rem",
              }}
            >
              <Typography sx={{ fontWeight: 600 }}>
                {schedule.project?.name}
              </Typography>
              <Typography sx={{ fontStyle: "italic" }} noWrap>
                {`${schedule.project?.building} ${schedule.project?.street} ${schedule.project?.barangay}, ${schedule.project?.city}`}
              </Typography>
              <Stack sx={{ flexDirection: "row", gap: 1 }}>
                <Typography sx={{ fontWeight: 600 }}>
                  {schedule?.startDate &&
                    dayjs(schedule?.startDate).format("hh:mm a")}
                </Typography>{" "}
                -{" "}
                <Typography sx={{ fontWeight: 600 }}>
                  {schedule?.endDate &&
                    dayjs(schedule?.endDate).format("hh:mm a")}
                </Typography>
              </Stack>
            </Stack>
          );
        })}
    </Stack>
  );
}
