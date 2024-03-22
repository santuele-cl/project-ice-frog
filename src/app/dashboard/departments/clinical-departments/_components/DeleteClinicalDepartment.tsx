"use client";
import { deleteRole } from "@/actions/roles-and-permissions";
import {
  Button,
  Divider,
  IconButton,
  Modal,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import { deleteClinicalDepartment } from "@/actions/departments/clinical-departments";
import { useState } from "react";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";

export default function DeleteClinicalDepartment({
  clinicalDepartmentId,
  clinicalDepartmentName,
}: {
  clinicalDepartmentName: string;
  clinicalDepartmentId: string;
}) {
  const deleteClinicalDepartmentWithId = deleteClinicalDepartment.bind(
    null,
    clinicalDepartmentId
  );
  const [open, setOpen] = useState(false);

  return (
    <>
      <Modal open={open} onClose={() => setOpen(false)}>
        <Stack
          sx={{
            alignItems: "center",
            justifyContent: "center",
            minHeight: "100vh",
          }}
        >
          <Paper sx={{ p: 3, width: 450 }}>
            <form action={deleteClinicalDepartmentWithId}>
              <Stack
                sx={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                }}
              >
                <Typography variant="h6">Please confirm</Typography>
                <IconButton
                  onClick={() => setOpen(false)}
                  color="error"
                  size="small"
                >
                  <CloseOutlinedIcon fontSize="medium" />
                </IconButton>
              </Stack>

              <Divider sx={{ my: 1 }} />
              <Stack sx={{ gap: 2, py: 2 }}>
                <Typography variant="h6" sx={{ my: 1 }}>
                  Are you sure you want to delete{" "}
                  <Typography
                    component="span"
                    color="primary.main"
                    sx={{ fontWeight: 600, mx: 1 }}
                    variant="h5"
                  >
                    {clinicalDepartmentName}
                  </Typography>
                  ?
                </Typography>
                <Stack
                  sx={{
                    flexDirection: "row",
                    justifyContent: "flex-end",
                    alignItems: "center",
                    gap: 2,
                  }}
                >
                  <Button variant="outlined" onClick={() => setOpen(false)}>
                    No
                  </Button>
                  <Button variant="contained" color="error" type="submit">
                    Confirm
                  </Button>
                </Stack>
              </Stack>
            </form>
          </Paper>
        </Stack>
      </Modal>
      <IconButton color="error" onClick={() => setOpen(true)}>
        <DeleteOutlineOutlinedIcon color="error" />
      </IconButton>
    </>
  );
}
