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
import EditScheduleForm from "./EditScheduleForm";
import { Schedule } from "@prisma/client";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";

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
  schedule: Schedule;
  name: string;
};

export default function EditSchedule({ schedule, name }: Props) {
  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
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
        aria-labelledby="schedule-edit-prompt"
        aria-describedby="schedule-edit-prompt-description"
      >
        <DialogTitle id="schedule-edit-prompt">{`${dayjs(
          schedule.startDate
        ).format("MMM DD, YYYY")} Schedule`}</DialogTitle>
        <DialogContent>
          <EditScheduleForm setOpen={setOpen} schedule={schedule} name={name} />
        </DialogContent>
      </Dialog>

      <Tooltip title="Edit schedule" placement="right">
        <IconButton onClick={() => setOpen(true)} size="small">
          <EditOutlinedIcon fontSize="small" />
        </IconButton>
      </Tooltip>
    </Box>
  );
}
