import { getCompleteEmployeeDetailsById } from "@/actions/users/users-action";
import ErrorComponent from "@/app/_ui/ErrorComponent";
import { Paper } from "@mui/material";
import { Prisma, Project } from "@prisma/client";
import ProjectEditForm from "../../../_components/ProjectEditForm";
import { getProjectById } from "@/actions/projects/projects-action";

export default async function ProjectDetailsEdit({ id }: { id: string }) {
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

  return <ProjectEditForm projectDetails={project.data as Project} />;
}
