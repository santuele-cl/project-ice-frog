import { EmployeeDelete } from "@/actions/users/users-action";
import {
  IconButton,
  Tooltip,
  Box,
  Typography,
  Button,
  Stack,
} from "@mui/material";
import Modal from "@mui/material/Modal";
import { useState } from "react";
import DeleteForeverOutlinedIcon from "@mui/icons-material/DeleteForeverOutlined";
import { deleteProject } from "@/actions/projects/projects-action";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export default function ProjectDeleteForm({ id }: { id: string }) {
  const deleteProjectWithId = deleteProject.bind(null, id);

  return (
    <Stack component="form" action={deleteProjectWithId}>
      <Tooltip title="Delete">
        <Button
          onClick={() => console.log(id)}
          type="submit"
          sx={{
            width: "150px",
            flex: "1",
            "&:hover": {
              backgroundColor: "success.main",
              color: "white",
              borderColor: "success.main",
            },
          }}
          color="success"
          variant="outlined"
        >
          YES
        </Button>
      </Tooltip>
    </Stack>
  );
}
