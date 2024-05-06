"use client";
import { useState } from "react";
import { Button, Modal, Stack } from "@mui/material";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";

import AddProjectSchedulesForm from "./AddProjectSchedulesForm";

export default function AddProjectSchedulesFormModal() {
  const [show, setShow] = useState(false);

  return (
    <Stack sx={{ minWidth: 100, ml: 1 }} gap={2} direction="row">
      <Button
        variant="contained"
        startIcon={<AddOutlinedIcon />}
        onClick={() => setShow(true)}
      >
        Assign Employee
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
