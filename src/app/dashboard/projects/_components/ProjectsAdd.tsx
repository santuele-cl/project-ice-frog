import { Button, Stack } from "@mui/material";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";

export default function EmployeeAdd() {
  return (
    <Stack gap={2} direction="row">
      <Button
        variant="contained"
        startIcon={<AddOutlinedIcon />}
        // onClick={() => setShowAddEmployeeFormModal(true)}
      >
        Add Project
      </Button>

      {/* <AddEmployeeFormModal
        show={showAddEmployeeFormModal}
        setShow={setShowAddEmployeeFormModal}
      /> */}
    </Stack>
  );
}
