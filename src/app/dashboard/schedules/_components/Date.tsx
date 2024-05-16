"use client";
import { getSchedulesByDate } from "@/actions/schedules/schedule-action";
import {
  Box,
  Button,
  ButtonBase,
  IconButton,
  Stack,
  Typography,
  getAccordionSummaryUtilityClass,
} from "@mui/material";
import dayjs from "dayjs";
import EventBusyIcon from "@mui/icons-material/EventBusy";
import AddIcon from "@mui/icons-material/Add";
import AddScheduleFormModal from "./AddScheduleFormModal";
import { useEffect, useState } from "react";
import { Prisma } from "@prisma/client";
import { useRouter } from "next/navigation";

type ScheduleWithProject = Prisma.ScheduleGetPayload<{
  include: { project: true };
}>;

interface DateProps {
  employeeId: string;
  endDate: Date;
  startDate: Date;
}

const style = {
  position: "absolute",
  top: "50%",
  right: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  p: 1,
};

const style2 = {
  position: "absolute",
  top: 0,
  right: 0,
  p: 1,
};

export default function Date({ employeeId, startDate, endDate }: DateProps) {
  const router = useRouter();
  const [employeeSchedules, setEmployeeSchedules] = useState<
    ScheduleWithProject[]
  >([]);

  console.log("emp sched", employeeSchedules);

  useEffect(() => {
    console.log("startDate : ", startDate);
    console.log("endDate : ", endDate);
    const fetchSchedules = async () => {
      const response = await getSchedulesByDate(employeeId, startDate, endDate);
      if (response.data && response.data.length > 0)
        setEmployeeSchedules(response.data);
      // else setEmployeeSchedules([]);
    };
    fetchSchedules();
  }, [employeeId, startDate, endDate]);

  return (
    <Stack
      sx={{
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {employeeSchedules &&
        employeeSchedules.map((schedule) => {
          const { startDate, endDate, project } = schedule;
          return (
            <Stack
              sx={{
                p: 1,
                // minHeight: 100,
                // maxWidth: 210,
                // minWidth: 100,
                // width: 100,
                bgcolor: "rgba(255, 255, 0, 0.4)",
                borderRadius: 2,
                marginBottom: "5px",
                fontSize: "0.8rem",
                overflow: "auto",
              }}
            >
              <ButtonBase
                // onClick={() => router.push(`/dashboard/projects/${project.id}`)}
                sx={{
                  textAlign: "left",
                  textOverflow: "ellipsis",
                  overflow: "hidden",
                  maxWidth: 210,
                  // fontWeight: 600,
                  color: "rgba(0,0,255,0.8)",
                  whiteSpace: "nowrap",
                  fontSize: "1rem",
                }}
              >
                {project?.name}
              </ButtonBase>

              <Stack sx={{ flexDirection: "row", gap: 1 }}>
                <Typography sx={{}}>
                  {dayjs(startDate).format("hh:mm")}
                </Typography>{" "}
                -{" "}
                <Typography sx={{}}>
                  {dayjs(endDate).format("hh:mm")}
                </Typography>
              </Stack>
            </Stack>
          );
        })}
      <Box
        sx={{
          ...(employeeId && employeeSchedules.length < 0 ? style : style2),
        }}
      >
        <AddScheduleFormModal />
      </Box>
    </Stack>
  );
}
