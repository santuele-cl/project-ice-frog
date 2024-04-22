import {
  getProjectById,
  getProjectScheduleGroupByUserId,
} from "@/actions/projects/projects-action";
import { Paper, Stack, Typography } from "@mui/material";
import ProjectSchedulesTableHeader from "./_components/ProjectSchedulesTableHeader";
import ProjectSchedulesTableBody from "./_components/ProjectSchedulesTableBody";

import ErrorComponent from "@/app/_ui/ErrorComponent";
import AddProjectSchedulesFormModal from "./_components/AddProjectSchedulesFormModal";

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
    // location,
    building,
    street,
    city,
    barangay,
    name,
    notes,
    createdAt,
    updatedAt,
  } = project.data;

  return (
    <Stack sx={{ gap: 2 }}>
      <Paper elevation={1} sx={{ p: 2 }}>
        <Typography variant="h4">{`${jobOrder}-99-JobOrder`}</Typography>
      </Paper>
      <Paper elevation={1} sx={{ p: 2 }}>
        <ProjectSchedulesTableHeader>
          <Typography>{name}</Typography>
          <Typography>{jobOrder}</Typography>
          <Typography>{`${building} ${street} ${barangay} ${city}`}</Typography>
        </ProjectSchedulesTableHeader>
      </Paper>
      <Paper elevation={1} sx={{ p: 2 }}>
        <ProjectSchedulesTableBody
          employeeIds={employeeIds.data}
          projectId={id}
        />
        <AddProjectSchedulesFormModal />
      </Paper>
    </Stack>
  );
}
