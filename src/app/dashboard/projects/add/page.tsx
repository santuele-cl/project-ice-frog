import { Divider, Paper, Stack, Typography } from "@mui/material";
import NewProjectForm from "../_components/NewProjectForm";

export default function ProjectCreatePage() {
  return (
    <Stack sx={{ gap: 2 }}>
      <Typography variant="h5">Add Project</Typography>
      <Paper
        elevation={1}
        sx={{
          p: 3,
        }}
      >
        <Stack sx={{ gap: 2 }}>
          <Typography variant="subtitle1">
            Please provide the required information in the spaces provided below
          </Typography>
          <Divider />
          <NewProjectForm />
        </Stack>
      </Paper>
    </Stack>
  );
}
