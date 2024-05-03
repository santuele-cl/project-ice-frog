"use client";
import { useState } from "react";
import { Button, Modal, Stack } from "@mui/material";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";

import AddProjectSchedulesForm from "./AddProjectSchedulesForm";

export default function AddProjectSchedulesFormModal() {
  const [show, setShow] = useState(false);

  return (
    <Stack sx={{ m: 3, minWidth: 100 }} gap={2} direction="row">
      <Button
        fullWidth
        sx={{ bgcolor: "gray.light", fontSize: 14, p: 2 }}
        onClick={() => setShow(true)}
        startIcon={<AddOutlinedIcon />}
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
