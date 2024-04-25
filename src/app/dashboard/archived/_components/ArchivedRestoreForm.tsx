import {  EmployeeRestore } from "@/actions/users/users-action";
import { Button, IconButton, Stack, Tooltip, } from "@mui/material";



export default function ArchivedRestoreForm({ id }: { id: string }) {
  const EmployeeRestoreWithId = EmployeeRestore.bind(null, id);

  return (
    <Stack component="form" action={EmployeeRestoreWithId}>
      <Tooltip title="Restore">
        <Button type="submit"   sx={{ width: "150px",
              flex: "1", '&:hover': { backgroundColor: 'success.main', color: 'white', borderColor: 'success.main', },
            }} color="success" variant="outlined">
              YES
            </Button>
      </Tooltip>
    </Stack>
  )
}
