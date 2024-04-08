import { getProjectById } from "@/actions/projects/projects-action";
import { Stack } from "@mui/material";

export default async function ProjectId({
  params: { id },
}: {
  params: { id: string };
}) {
  const res = await getProjectById(id);

  if (res.error) throw new Error(res.error);

  return (
    <Stack>
      {`Project ${id}`}
      <pre>{JSON.stringify(res.data, null, 2)}</pre>
    </Stack>
  );
}
