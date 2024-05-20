import { getSchedulesByDate } from "@/actions/schedules/schedule-action";
import { IconButton, Stack, Tooltip, Typography } from "@mui/material";
import dayjs from "dayjs";
import EventBusyIcon from "@mui/icons-material/EventBusy";
import AddIcon from "@mui/icons-material/Add";
import AddScheduleFormModal from "./AddScheduleFormModal";
import DeleteIcon from "@mui/icons-material/Delete";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";

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
                p: 1,
                bgcolor: "rgba(255, 255, 0, 0.4)",
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
                  {project?.name}
                </Typography>
                <Typography sx={{ fontSize: "0.825rem" }}>
                  Project Manager
                </Typography>
                {/* <Typography sx={{ fontSize: "0.825rem" }}>
                  Project Manager
                </Typography> */}
              </Stack>
              <Stack sx={{ alignSelf: "flex-start", gap: "5px" }}>
                <Tooltip title="Delete schedule" placement="right">
                  <IconButton size="small">
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Edit schedule" placement="right">
                  <IconButton size="small">
                    <EditOutlinedIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Add overtime" placement="right">
                  <IconButton size="small">
                    <AddOutlinedIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Stack>
            </Stack>
          );
        })}
    </Stack>
  );
}
