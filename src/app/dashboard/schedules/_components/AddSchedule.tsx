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
import dayjs, { Dayjs } from "dayjs";

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
  date: Date;
  userId: string;
  name: string;
  variant: "contained" | "normal";
};

export default function AddSchedule({ date, userId, name, variant }: Props) {
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
          sx: { border: "1px solid rgba(0,0,0,0.4)" },
        }}
        hideBackdrop
        open={open}
        onClose={handleClose}
        aria-labelledby="schedule-add-prompt"
        aria-describedby="schedule-add-prompt-description"
      >
        <DialogTitle id="schedule-add-prompt">{`${dayjs(date).format(
          "MMM DD, YYYY"
        )} Schedule`}</DialogTitle>
        <DialogContent>
          <AddScheduleForm
            setOpen={setOpen}
            date={date}
            name={name}
            userId={userId}
          />
        </DialogContent>
      </Dialog>

      <Tooltip title="Add schedule" placement="right">
        {variant === "contained" ? (
          <IconButton onClick={() => setOpen(true)} size="small">
            <AddOutlinedIcon
              fontSize="small"
              sx={{ color: "rgba(0,0,0,0.2)" }}
            />
          </IconButton>
        ) : (
          <IconButton onClick={() => setOpen(true)} size="small">
            <AddOutlinedIcon
              fontSize="small"
              sx={{ color: "rgba(0,0,0,0.2)" }}
            />
          </IconButton>
        )}
      </Tooltip>
    </Box>
  );
}
