"use client";
import { Drawer, IconButton, Stack, Tooltip } from "@mui/material";
import { useEffect, useState } from "react";
import { Schedule } from "@prisma/client";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import { getScheduleById } from "@/actions/schedules/schedule-action";
import EmployeeScheduleEditForm from "@/app/dashboard/employees/[id]/_components/EmployeeScheduleEditForm";

export default function ProjectSchedulesEmployeeRowEditModal({
  scheduleId,
}: {
  scheduleId: string;
}) {
  const [show, setShow] = useState(false);
  const [schedule, setSchedule] = useState<Schedule>();
  const onClose = (event: any) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setShow(!show);
  };

  useEffect(() => {
    async function fetchSchedule() {
      const schedule = await getScheduleById(scheduleId);
      if (schedule.data) setSchedule(schedule.data);
    }
    fetchSchedule();
  }, []);

  return (
    <Stack gap={2} direction="row">
      <Tooltip title="Edit Schedule">
        <IconButton onClick={() => setShow(true)}>
          <BorderColorIcon fontSize="medium" />
        </IconButton>
      </Tooltip>

      <Drawer
        anchor="bottom"
        open={show}
        onClose={onClose}
        hideBackdrop
        ModalProps={{
          slotProps: {
            backdrop: { sx: { background: "none" } },
          },
        }}
      >
        {schedule && (
          <EmployeeScheduleEditForm setShow={setShow} schedule={schedule} />
        )}
      </Drawer>
    </Stack>
  );
}
