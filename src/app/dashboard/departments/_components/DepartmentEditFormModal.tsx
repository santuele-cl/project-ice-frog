"use client";
import { IconButton, Modal, Stack, Tooltip } from "@mui/material";
import { useEffect, useState } from "react";
import { Department } from "@prisma/client";
import { getDepartmentById } from "@/actions/departments/department-action";
import { enqueueSnackbar } from "notistack";
import DepartmentEditForm from "./DepartmentEditForm";
import BorderColorIcon from "@mui/icons-material/BorderColor";

type Props = {
  department: Department;
};

export default function DepartmentEditFormModal({ department }: Props) {
  const [show, setShow] = useState(false);

  return (
    <Stack gap={2} direction="row">
      <Tooltip title="Edit Details">
        <IconButton onClick={() => setShow(true)}>
          <BorderColorIcon fontSize="medium" />
        </IconButton>
      </Tooltip>
      <Modal open={show} onClose={() => setShow(false)}>
        <Stack
          sx={{
            alignItems: "center",
            justifyContent: "center",
            minHeight: "100vh",
          }}
        >
          {department && (
            <DepartmentEditForm setShow={setShow} department={department} />
          )}
        </Stack>
      </Modal>
    </Stack>
  );
}
