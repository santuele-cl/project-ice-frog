"use client";

import {
  Box,
  Button,
  IconButton,
  Modal,
  Typography,
  Tooltip,
  Stack,
  SxProps,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContentText,
  DialogContent,
} from "@mui/material";
import { useState } from "react";
import AddScheduleForm from "./AddScheduleForm";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { enqueueSnackbar } from "notistack";
import { deleteSchedule } from "@/actions/schedules/schedule-action";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";

const style: SxProps = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  p: 4,
  boxShadow: 10,
};

type Props = {
  scheduleId: string;
};

export default function AddOvertime({ scheduleId }: Props) {
  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = async () => {
    console.log("add schedule submit button clicked");
    // try {
    //   const res = await deleteSchedule(scheduleId);

    //   if (res?.error) enqueueSnackbar(res.error, { variant: "error" });
    //   if (res?.success) {
    //     handleClose();
    //     enqueueSnackbar(res.success, { variant: "success" });
    //   }
    // } catch (error) {
    //   enqueueSnackbar(JSON.stringify(error), { variant: "error" });
    // }
  };

  return (
    <Box>
      <Dialog
        PaperProps={{
          elevation: 15,
          sx: { border: "1px solid rgba(0,0,0,0.2)" },
        }}
        hideBackdrop
        open={open}
        onClose={handleClose}
        aria-labelledby="overtime-add-prompt"
        aria-describedby="overtime-add-prompt-description"
      >
        <DialogTitle id="overtime-add-prompt">Add Overtime Prompt</DialogTitle>
        <DialogContent>
          <DialogContentText id="overtime-add-prompt-description">
            Are you sure you want to add a overtime?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} autoFocus>
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="error">
            Add
          </Button>
        </DialogActions>
      </Dialog>
      {/* <Modal open={open} onClose={handleClose} hideBackdrop>
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
              onClick={() => setOpen(false)}
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
            <Stack
              component="form"
              // action={deleteScheduleWithId}
            >
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
      </Modal> */}
      <Tooltip title="Add overtime" placement="right">
        <IconButton onClick={() => setOpen(true)} size="small">
          <AddOutlinedIcon fontSize="small" />
        </IconButton>
      </Tooltip>
    </Box>
  );
}
