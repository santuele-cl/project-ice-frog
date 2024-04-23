
// import { EmployeeDelete } from "@/actions/roles-and-permissions";
import { IconButton } from "@mui/material";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import { EmployeeArchive } from "@/actions/users/users-action";



export default function EmployeeArchiveButton({ id }: { id: string }) {
    const EmployeeArchiveWithId = EmployeeArchive.bind(null, id);

    return (
      <form action={EmployeeArchiveWithId}>
        <IconButton type="submit" color="error">
          <DeleteOutlineOutlinedIcon color="error" />
        </IconButton>
      </form>
    );
}
