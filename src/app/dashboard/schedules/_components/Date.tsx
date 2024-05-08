import { getSchedulesByDate } from "@/actions/schedules/schedule-action";
import { IconButton, Stack, Typography } from "@mui/material";
import dayjs from "dayjs";
import EventBusyIcon from "@mui/icons-material/EventBusy";
import AddIcon from "@mui/icons-material/Add";
import AddScheduleFormModal from "./AddScheduleFormModal";
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
      {!schedules.data && <AddScheduleFormModal />}
      {schedules.data &&
        schedules.data.map((schedule) => {
          const { startDate, endDate, project } = schedule;
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
              <Typography sx={{ fontWeight: 600 }}>{project?.name}</Typography>
              <Typography sx={{ fontStyle: "italic" }} noWrap>
                {`${project?.building} ${project?.street} ${project?.barangay}, ${project?.city}`}
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
