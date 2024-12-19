"use client";
import { Button, Drawer, IconButton, Modal, Stack } from "@mui/material";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import { useState } from "react";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import EmployeeScheduleAddForm from "./EmployeeScheduleAddForm";

export default function EmployeeScheduleEditFormModal() {
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
        <EmployeeScheduleAddForm setShow={setShow} />
      </Drawer>
    </Stack>
  );
}
