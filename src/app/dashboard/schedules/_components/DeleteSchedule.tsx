"use client";

import {
  Box,
  Button,
  IconButton,
  Modal,
  Typography,
  Tooltip,
} from "@mui/material";
import { useState } from "react";
import AddScheduleForm from "./AddScheduleForm";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  p: 4,
};

export default function DeleteSchedule() {
  const [open, setOpen] = useState(false);
  
  return (
    <Box>
      <Modal open={open} onClose={() => setOpen(false)}>
        <Box sx={style}>
          <AddScheduleForm />
        </Box>
      </Modal>
      <Tooltip title="Delete schedule" placement="right">
        <IconButton onClick={() => setOpen(true)} size="small">
          <DeleteIcon fontSize="small" />
        </IconButton>
      </Tooltip>
    </Box>
  );
}
