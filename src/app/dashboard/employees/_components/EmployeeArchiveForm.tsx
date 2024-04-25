import {  EmployeeArchive, EmployeeRestore } from "@/actions/users/users-action";
import { Button, IconButton, Stack, Tooltip, } from "@mui/material";



export default function EmployeeArchiveForm({ id }: { id: string }) {
  const EmployeeArchiveWithId = EmployeeArchive.bind(null, id);

  return (
    <Stack component="form" action={EmployeeArchiveWithId} sx={{flex: "1"}}>
      <Tooltip title="Restore">
        <Button type="submit"   sx={{ width: "150px",
              flex: "1", '&:hover': { backgroundColor: 'success.main', color: 'white', borderColor: 'success.main' },
            }} color="success" variant="outlined">
              YES
            </Button>
      </Tooltip>
    </Stack>
  )
}