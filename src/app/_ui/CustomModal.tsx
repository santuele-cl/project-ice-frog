"use client";
import { Modal, Stack } from "@mui/material";
import { useState } from "react";

export default function EditServiceDepartmentFormModal({
  FormHeader,
  Form,
}: {
  FormHeader: React.ElementType;
  Form: React.ElementType;
}) {
  const [open, setOpen] = useState(false);
  return (
    <Stack>
      <FormHeader setOpen={setOpen} open={open} />

      <Modal open={open} onClose={() => setOpen(false)}>
        <Stack
          sx={{
            alignItems: "center",
            justifyContent: "center",
            minHeight: "100vh",
          }}
        >
          <Form setOpen={setOpen} open={open} />
        </Stack>
      </Modal>
    </Stack>
  );
}
