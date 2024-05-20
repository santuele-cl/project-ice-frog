"use client";

import { Box, Button, IconButton, Modal, Typography } from "@mui/material";
import { useState } from "react";
import AddScheduleForm from "./AddScheduleForm";
import AddIcon from "@mui/icons-material/Add";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  p: 4,
};

export default function AddScheduleFormModal() {
  const [showAddScheduleModal, setShowAddScheduleModal] = useState(false);
  return (
    <Box>
      <Modal
        open={showAddScheduleModal}
        onClose={() => setShowAddScheduleModal(false)}
      >
        <Box sx={style}>
          <AddScheduleForm />
        </Box>
      </Modal>
      <IconButton onClick={() => setShowAddScheduleModal(true)} size="small">
        <AddIcon sx={{ color: "rgba(0,0,0,0.2)" }} fontSize="small" />
      </IconButton>
    </Box>
  );
}
