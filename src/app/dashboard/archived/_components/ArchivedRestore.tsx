import { EmployeeArchive, EmployeeRestore } from "@/actions/users/users-action";
import { IconButton, Tooltip } from "@mui/material";
import SettingsBackupRestoreOutlinedIcon from "@mui/icons-material/SettingsBackupRestoreOutlined";

export default function ArchivedRestore({ id }: { id: string }) {
  const EmployeeRestoreWithId = EmployeeRestore.bind(null, id);

  return (
    <form action={EmployeeRestoreWithId}>
      <Tooltip title="Restore">
        <IconButton type="submit" color="success">
          <SettingsBackupRestoreOutlinedIcon color="success" />
        </IconButton>
      </Tooltip>
    </form>
  );
}
