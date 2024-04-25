"use client"
import { EmployeeArchive, EmployeeRestore } from "@/actions/users/users-action";
import { IconButton, Tooltip, Box, Typography, Button, Stack } from "@mui/material";
import SettingsBackupRestoreOutlinedIcon from '@mui/icons-material/SettingsBackupRestoreOutlined';
import Modal from '@mui/material/Modal';
import { useState } from "react";
import ArchivedRestoreForm from "./ArchivedRestoreForm";

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};



export default function ArchivedRestore({ id }: { id: string }) {
  const EmployeeRestoreWithId = EmployeeRestore.bind(null, id);

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);



  return (
    <Stack >
      <Tooltip title="Restore">
        <IconButton color="success" onClick={handleOpen}>
          <SettingsBackupRestoreOutlinedIcon color="success" />
        </IconButton>
      </Tooltip>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2" sx={{ display: "flex", justifyContent: "center" }} >
            Are you sure?
          </Typography>
          <Stack id="modal-modal-description" sx={{ mt: 2, flexDirection: "row", gap: 2 }}>
            <Button onClick={ handleClose} sx={{ width: "150px",
              flex: "1", '&:hover': { backgroundColor: 'error.main', color: 'white', borderColor: 'error.main', },
            }} color="error" variant="outlined">
              NO
            </Button>
            <Stack sx={{flex: "1"}}>
              <ArchivedRestoreForm id={id}/>
            </Stack>
          </Stack>
        </Box>
      </Modal>
    </Stack>
  )
}
