"use client";
import { Drawer, IconButton, Stack } from "@mui/material";
import { useState } from "react";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import EmployeeScheduleEditForm from "./EmployeeScheduleEditForm";
import { Schedule } from "@prisma/client";

export default function EmployeeScheduleEditFormModal({
  schedule,
}: {
  schedule: Schedule;
}) {
  const [show, setShow] = useState(false);
  const onClose = (event: any) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setShow(!show);
  };
  return (
    <Stack gap={2} direction="row">
      <IconButton onClick={() => setShow(true)}>
        <EditOutlinedIcon />
      </IconButton>

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
        <EmployeeScheduleEditForm setShow={setShow} schedule={schedule} />
      </Drawer>
    </Stack>
  );
}
