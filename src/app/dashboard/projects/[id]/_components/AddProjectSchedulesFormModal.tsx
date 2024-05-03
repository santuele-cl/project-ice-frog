"use client";
import { Button, Modal, Stack } from "@mui/material";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import { useState } from "react";
import AddProjectSchedulesForm from "./AddProjectSchedulesForm";
// import EmployeeScheduleAddForm from "./EmployeeScheduleAddForm";

export default function AddProjectSchedulesFormModal() {
  const [show, setShow] = useState(false);

  return (
    <Stack sx={{ m: 3, minWidth: 100 }} gap={2} direction="row">
      <Button
        sx={{ width: "100%", bgcolor: "rgba(0,0,255,0.1)", fontSize: 14 }}
      >
        <AddOutlinedIcon /> Assign Employee
      </Button>

      <Modal open={show} onClose={() => setShow(false)}>
        <Stack
          sx={{
            alignItems: "center",
            justifyContent: "center",
            minHeight: "100vh",
          }}
        >
          <AddProjectSchedulesForm setShow={setShow} />
        </Stack>
      </Modal>
    </Stack>
  );
}
