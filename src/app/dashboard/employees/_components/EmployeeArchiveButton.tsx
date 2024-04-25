// import { EmployeeDelete } from "@/actions/roles-and-permissions";
// import { IconButton, Tooltip } from "@mui/material";
// import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
// import { EmployeeArchive } from "@/actions/users/users-action";


// export default function EmployeeArchiveButton({ id }: { id: string }) {
//   const EmployeeArchiveWithId = EmployeeArchive.bind(null, id);

//   return (
//     <form action={EmployeeArchiveWithId}>
//       <Tooltip title="Delete Project">
//         <IconButton type="submit" color="error">
//           <DeleteIcon fontSize="medium" color="error" />
//         </IconButton>
//       </Tooltip>
//     </form>
//   );
// }




"use client"
import { EmployeeArchive, EmployeeRestore } from "@/actions/users/users-action";
import { IconButton, Tooltip, Box, Typography, Button, Stack } from "@mui/material";
import SettingsBackupRestoreOutlinedIcon from '@mui/icons-material/SettingsBackupRestoreOutlined';
import Modal from '@mui/material/Modal';
import { useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import EmployeeArchiveForm from "./EmployeeArchiveForm";

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
      <Tooltip title="Delete Project">
        <IconButton  color="error" onClick={handleOpen}>
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
          <Typography id="modal-modal-title" variant="h6" component="h2" sx={{ display: "flex", justifyContent: "center" }} >
          Are you sure you want to delete this Employee?
          </Typography>
          <Stack id="modal-modal-description" sx={{ mt: 2, flexDirection: "row", gap: 2}}>
            <Button onClick={handleClose} sx={{ width: "150px",
              flex: "1", '&:hover': { backgroundColor: 'error.main', color: 'white', borderColor: 'error.main', },
            }} color="error" variant="outlined">
              NO
            </Button>
            <Stack sx={{ flex: "1"}}>
              <EmployeeArchiveForm id={id} />
            </Stack>
          </Stack>
        </Box>
      </Modal>
    </Stack>
  )
}
