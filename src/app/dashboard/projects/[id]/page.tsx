import { getProjectById } from "@/actions/projects/projects-action";
import { Paper, Stack, Typography } from "@mui/material";
import ProjectSchedulesTableHeader from "./_components/ProjectSchedulesTableHeader";
import ProjectSchedulesTableBody from "./_components/ProjectSchedulesTableBody";

export default async function ProjectId({
  params: { id },
}: {
  params: { id: string };
}) {
  const res = await getProjectById(id);

  if (res.error || !res.data) throw new Error(res.error);

  const {
    schedules,
    id: projectId,
    jobOrder,
    location,
    name,
    notes,
    createdAt,
    updatedAt,
  } = res.data;

  return (
    <Paper elevation={1} sx={{ p: 2 }}>
      <Stack>
        <ProjectSchedulesTableHeader>
          <Typography>{name}</Typography>
          <Typography>{jobOrder}</Typography>
          <Typography>{location}</Typography>
        </ProjectSchedulesTableHeader>
        <ProjectSchedulesTableBody schedules={schedules} />
        {/* {`Project ${id}`}
      <pre>{JSON.stringify(res.data, null, 2)}</pre> */}
      </Stack>
    </Paper>
  );
}
