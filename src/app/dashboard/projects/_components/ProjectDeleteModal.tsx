"use client";
import {
  IconButton,
  Tooltip,
  Box,
  Typography,
  Button,
  Stack,
} from "@mui/material";
import Modal from "@mui/material/Modal";
import { FormEvent, useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";

import { deleteProject } from "@/actions/projects/projects-action";
import ProjectDeleteForm from "./ProjectDeleteForm";
import { enqueueSnackbar } from "notistack";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export default function ProjectDeleteModal({ id }: { id: string }) {
  const deleteProjectWithId = deleteProject.bind(null, id);

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const response = await deleteProject(id);

      if (response.error) {
        enqueueSnackbar(response.error, { variant: "error" });
      }

      if (response.success) {
        enqueueSnackbar(response.success, { variant: "success" });
      }
    } catch (error) {
      enqueueSnackbar(JSON.stringify(error), { variant: "error" });
    }
  };

  return (
    <Stack>
      <Tooltip title="Delete Project">
        <IconButton color="error" onClick={handleOpen}>
          <DeleteIcon fontSize="medium" color="error" />
        </IconButton>
      </Tooltip>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography
            id="modal-modal-title"
            variant="h6"
            component="h2"
            sx={{ display: "flex", justifyContent: "center" }}
          >
            Are you sure you want to delete this Project?
          </Typography>
          <Stack
            id="modal-modal-description"
            sx={{ mt: 2, flexDirection: "row", gap: 2 }}
          >
            <Button
              onClick={handleClose}
              sx={{
                width: "150px",
                flex: "1",
                "&:hover": {
                  backgroundColor: "sucess.main",
                  color: "white",
                  borderColor: "sucess.main",
                },
              }}
              color="success"
              variant="outlined"
            >
              Close
            </Button>
            <Stack component="form" onSubmit={onSubmit}>
              <Button
                type="submit"
                sx={{
                  width: "150px",
                  flex: "1",
                  "&:hover": {
                    backgroundColor: "error.main",
                    color: "white",
                    borderColor: "error.main",
                  },
                }}
                color="error"
                variant="outlined"
              >
                Delete Project
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Modal>
    </Stack>
  );
}
