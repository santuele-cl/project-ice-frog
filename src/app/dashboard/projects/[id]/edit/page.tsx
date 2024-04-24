import { Divider, Paper, Stack, Typography } from "@mui/material";
import ProjectDetailsEdit from "./_components/ProjectDetailsEdit";

export default function ProjectEditPage({
  params: { id },
}: {
  params: { id: string };
}) {
  return (
    <Stack sx={{ gap: 2 }}>
      <Typography variant="h5">Edit Project</Typography>
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
          <ProjectDetailsEdit id={id} />
        </Stack>
      </Paper>
    </Stack>
  );
}
