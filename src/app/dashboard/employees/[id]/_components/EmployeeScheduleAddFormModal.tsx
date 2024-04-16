"use client";
import { Button, Modal, Stack } from "@mui/material";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import { useState } from "react";
import EmployeeScheduleAddForm from "./EmployeeScheduleAddForm";

export default function EmployeeScheduleAddFormModal() {
  const [show, setShow] = useState(false);

  return (
    <Stack gap={2} direction="row">
      <Button
        variant="contained"
        startIcon={<AddOutlinedIcon />}
        onClick={() => setShow(true)}
      >
        Add Schedule
      </Button>
      <Modal open={show} onClose={() => setShow(false)}>
        <Stack
          sx={{
            alignItems: "center",
            justifyContent: "center",
            minHeight: "100vh",
          }}
        >
          <EmployeeScheduleAddForm setShow={setShow} />
        </Stack>
      </Modal>
    </Stack>
  );
}
