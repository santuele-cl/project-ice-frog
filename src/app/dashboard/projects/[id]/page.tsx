import {
  getProjectById,
  getProjectScheduleGroupByUserId,
} from "@/actions/projects/projects-action";
import { Box, Paper, Stack, Typography } from "@mui/material";
import ProjectSchedulesTableBody from "./_components/ProjectSchedulesTableBody";

import ErrorComponent from "@/app/_ui/ErrorComponent";
import AddProjectSchedulesFormModal from "./_components/AddProjectSchedulesFormModal";
import ProjectDetails from "../_components/ProjectDetails";

export default async function ProjectId({
  params: { id },
}: {
  params: { id: string };
}) {
  const project = await getProjectById(id);

  if (project.error || !project.data)
    return (
      <Paper
        elevation={1}
        sx={{ p: 2, position: "relative", height: "100%", weight: "100%" }}
      >
        <ErrorComponent errMessage={String(project.error)} />
      </Paper>
    );

  const employeeIds = await getProjectScheduleGroupByUserId(id);

  if (employeeIds.error || !employeeIds.data)
    return (
      <Paper elevation={1} sx={{ p: 2 }}>
        <ErrorComponent errMessage={String(employeeIds.error)} />
      </Paper>
    );

  return (
    <Stack sx={{ gap: 2 }}>
      <Paper elevation={1} sx={{ p: 2 }}>
        {project.data && <ProjectDetails details={project.data} />}
      </Paper>
    
      <Paper elevation={1} sx={{ p: 2 }}>
        <ProjectSchedulesTableBody
          employeeIds={employeeIds.data}
          projectId={id}
        />
      </Paper>
    </Stack>
  );
}
