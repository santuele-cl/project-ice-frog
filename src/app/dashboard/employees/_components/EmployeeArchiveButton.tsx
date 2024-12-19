// import { EmployeeDelete } from "@/actions/roles-and-permissions";
import { IconButton, Tooltip } from "@mui/material";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import { EmployeeArchive } from "@/actions/users/users-action";
import DeleteIcon from "@mui/icons-material/Delete";

export default function EmployeeArchiveButton({ id }: { id: string }) {
  const EmployeeArchiveWithId = EmployeeArchive.bind(null, id);

  return (
    <form action={EmployeeArchiveWithId}>
      <Tooltip title="Delete Project">
        <IconButton type="submit" color="error">
          <DeleteIcon fontSize="medium" color="error" />
        </IconButton>
      </Tooltip>
    </form>
  );
}
