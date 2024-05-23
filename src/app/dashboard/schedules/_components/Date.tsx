import { getSchedulesByDate } from "@/actions/schedules/schedule-action";
import { Button, IconButton, Stack, Tooltip, Typography } from "@mui/material";
import dayjs from "dayjs";
import AddScheduleFormModal from "./AddSchedule";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteSchedule from "./DeleteSchedule";
import AddOvertime from "./AddOvertime";
import AddSchedule from "./AddSchedule";
import EditSchedule from "./EditSchedule";
import Link from "next/link";

interface DateProps {
  employeeId: string;
  endDate: Date;
  startDate: Date;
  name: string;
}

export default async function Date({
  name,
  employeeId,
  startDate,
  endDate,
}: DateProps) {
  const schedules = await getSchedulesByDate(employeeId, startDate, endDate);

  return (
    <Stack sx={{ gap: 1, flexDirection: "row" }}>
      {schedules.data && (
        <AddSchedule
          date={startDate}
          userId={employeeId}
          name={name}
          variant="contained"
        />
      )}
      <Stack
        sx={{ justifyContent: "center", alignItems: "center", flexGrow: 1 }}
      >
        {!schedules.data && (
          <AddSchedule
            date={startDate}
            userId={employeeId}
            name={name}
            variant="normal"
          />
        )}

        {schedules.data &&
          schedules.data.map((schedule) => {
            const { startDate, endDate, project, id, isOvertime } = schedule;
            return (
              <Stack
                sx={{
                  p: 1,
                  bgcolor: isOvertime
                    ? "rgba(255, 148, 112, 0.45)"
                    : "rgba(255, 255, 0, 0.4)",
                  borderRadius: 2,
                  marginBottom: "5px",
                  fontSize: "0.8rem",
                  flexDirection: "row",
                  gap: 1,
                }}
              >
                <Stack>
                  <Stack sx={{ flexDirection: "row", gap: 1 }}>
                    <Typography sx={{ fontWeight: 600, fontSize: "0.825rem" }}>
                      {dayjs(startDate).format("hh:mm a")}
                    </Typography>{" "}
                    -{" "}
                    <Typography sx={{ fontWeight: 600, fontSize: "0.825rem" }}>
                      {dayjs(endDate).format("hh:mm a")}
                    </Typography>
                  </Stack>
                  <Typography sx={{ fontSize: "0.825rem" }}>
                    <Link href={`/dashboard/projects/${project.id}`}>
                      {project?.name}
                    </Link>
                  </Typography>
                  <Typography sx={{ fontSize: "0.825rem" }}>
                    <Link
                      href={`/dashboard/employees/${project.projectManagerId}`}
                    >
                      {`PM: ${project.projectManager.profile?.fname} ${project.projectManager.profile?.lname}`}
                    </Link>
                  </Typography>
                </Stack>
                <Stack sx={{ alignSelf: "flex-start", gap: "5px" }}>
                  <DeleteSchedule scheduleId={id} />
                  <EditSchedule schedule={schedule} name={name} />
                  {/* <AddOvertime scheduleId={id} /> */}
                </Stack>
              </Stack>
            );
          })}
      </Stack>
    </Stack>
  );
}
