"use client";
import { Button, Modal, Stack } from "@mui/material";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import { useState } from "react";
import DepartmentAddForm from "./DepartmentAddForm";
// import ProjectAddForm from "./ProjectAddForm";

export default function DepartmentAddFormModal() {
  const [show, setShow] = useState(false);

  return (
    <Stack gap={2} direction="row">
      <Button
        variant="contained"
        startIcon={<AddOutlinedIcon />}
        onClick={() => setShow(true)}
      >
        Add Department
      </Button>
      <Modal open={show} onClose={() => setShow(false)}>
        <Stack
          sx={{
            alignItems: "center",
            justifyContent: "center",
            minHeight: "100vh",
          }}
        >
          <DepartmentAddForm setShow={setShow} />
        </Stack>
      </Modal>
    </Stack>
  );
}
