import {
  getProjectById,
  getProjectScheduleGroupByUserId,
} from "@/actions/projects/projects-action";
import { Paper, Stack, Typography } from "@mui/material";
import ProjectSchedulesTableHeader from "./_components/ProjectSchedulesTableHeader";
import ProjectSchedulesTableBody from "./_components/ProjectSchedulesTableBody";

import ErrorComponent from "@/app/_ui/ErrorComponent";

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

  const {
    id: projectId,
    jobOrder,
    location,
    name,
    notes,
    createdAt,
    updatedAt,
  } = project.data;

  return (
    <Paper elevation={1} sx={{ p: 2 }}>
      <Stack>
        <ProjectSchedulesTableHeader>
          <Typography>{name}</Typography>
          <Typography>{jobOrder}</Typography>
          <Typography>{location}</Typography>
        </ProjectSchedulesTableHeader>
        <ProjectSchedulesTableBody
          employeeIds={employeeIds.data}
          projectId={id}
        />
      </Stack>
    </Paper>
  );
}
