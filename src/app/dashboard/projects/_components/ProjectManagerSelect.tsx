"use client";
import { getProjectManagers } from "@/actions/users/users-action";
import AutoComplete from "@/app/_ui/AutoComplete";
import { Box } from "@mui/material";
import { useEffect, useState } from "react";

type ProjectManagerSelectProps = {
  required: boolean;
  control: any;
};

export default function ProjectManagerSelect({
  required,
  control,
}: ProjectManagerSelectProps) {
  const [projectManagers, setprojectManagers] = useState<
    { id: string; name: string }[]
  >([]);

  useEffect(() => {
    async function fetchProjectManager() {
      const res = await getProjectManagers();
      if (res?.success) setprojectManagers(res.data);
    }
    fetchProjectManager();
  }, []);
  return (
    <Box>
      {projectManagers && !!projectManagers.length && (
        <AutoComplete
          required={required}
          control={control}
          name="projectManagerId"
          options={projectManagers}
          labelIdentifier="name"
          valueIdentifier="id"
          fieldLabel="Project Manager"
        />
      )}
    </Box>
  );
}
