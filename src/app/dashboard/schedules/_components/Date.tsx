import { getSchedulesByDate } from "@/actions/schedules/schedule-action";
import { Stack, Typography } from "@mui/material";
import dayjs from "dayjs";
import EventBusyIcon from "@mui/icons-material/EventBusy";

interface DateProps {
  employeeId: string;
  endDate: Date;
  startDate: Date;
}

export default async function Date({
  employeeId,
  startDate,
  endDate,
}: DateProps) {
  const schedules = await getSchedulesByDate(employeeId, startDate, endDate);

  return (
    <Stack sx={{ justifyContent: "center", alignItems: "center" }}>
      {!schedules.data && <EventBusyIcon sx={{ color: "rgba(0,0,0,0.2)" }} />}
      {schedules.data &&
        schedules.data.map((schedule) => {
          const { startDate, endDate, project } = schedule;
          return (
            <Stack
              sx={{
                p: 2,
                height: 150,
                width: 220,
                bgcolor: "rgba(255, 0, 0, 0.1)",
              }}
            >
              <Typography variant="h6">{project?.name}</Typography>
              <Typography sx={{ fontStyle: "italic" }} noWrap>
                {project?.location}
              </Typography>
              <Stack sx={{ flexDirection: "row", gap: 1 }}>
                <Typography sx={{ fontWeight: 600 }}>
                  {dayjs(startDate).format("hh:mm a")}
                </Typography>{" "}
                -{" "}
                <Typography sx={{ fontWeight: 600 }}>
                  {dayjs(endDate).format("hh:mm a")}
                </Typography>
              </Stack>
            </Stack>
          );
        })}
    </Stack>
  );
}
