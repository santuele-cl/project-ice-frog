"use client";

import { Box, Button, IconButton, Modal, Typography } from "@mui/material";
import { useState } from "react";
import AddMultipleScheduleForm from "./AddMultipleScheduleForm";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  p: 4,
};

export default function AddMultipleScheduleModal() {
  const [showAddScheduleModal, setShowAddScheduleModal] = useState(false);
  return (
    <Box>
      <Modal
        open={showAddScheduleModal}
        onClose={() => setShowAddScheduleModal(false)}
      >
        <Box sx={style}>
          <AddMultipleScheduleForm />
        </Box>
      </Modal>
      <Button variant="contained" onClick={() => setShowAddScheduleModal(true)}>
        Add Schedule
      </Button>
    </Box>
  );
}
