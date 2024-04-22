import {
  getProjectById,
  getProjectScheduleGroupByUserId,
} from "@/actions/projects/projects-action";
import { Paper, Stack, Typography } from "@mui/material";
import ProjectSchedulesTableHeader from "./_components/ProjectSchedulesTableHeader";
import ProjectSchedulesTableBody from "./_components/ProjectSchedulesTableBody";
import dayjs from "dayjs";

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
        {project.data && <ProjectDetails details={project.data}/>}
        {/* <Typography variant="h4">{`Job Order No. - ${jobOrder}`}</Typography>

        <Paper elevation={1} sx={{ p: 2 }}>
          
            <Typography>Project Name: {name} </Typography>
            <Typography>{`Location: ${building} ${street} ${barangay}, ${city}`}</Typography>
            <Typography>
              Start Date: {dayjs(startDate).format("MMM DD, YYYY hh:mm a")}
            </Typography>
            <Typography>
              End Date: {dayjs(endDate).format("MMM DD, YYYY hh:mm a")}
            </Typography>
            <Typography>
              Date Created: {dayjs(createdAt).format("MMM DD, YYYY hh:mm a")}
            </Typography>
            <Typography>
              Date Updated: {dayjs(updatedAt).format("MMM DD, YYYY hh:mm a")}
            </Typography>

        </Paper> */}
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
