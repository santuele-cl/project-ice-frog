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
import { useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import { deleteSchedule } from "@/actions/schedules/schedule-action";

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

export default function ProjectScheduleEmployeeRowDeleteModal({
  id,
}: {
  id: string;
}) {
  const deleteScheduleWithId = deleteSchedule.bind(null, id);

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <Stack>
      <Tooltip title="Delete Schedule">
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
            Are you sure you want to delete this Schedule?
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
            <Stack component="form" action={deleteScheduleWithId}>
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
                Delete Schedule
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Modal>
    </Stack>
  );
}
