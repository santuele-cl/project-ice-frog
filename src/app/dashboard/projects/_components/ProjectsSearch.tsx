"use client";
import { Stack, TextField } from "@mui/material";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import ProjectsSearchByProjectName from "./ProjectsSearchByProjectName";
import ProjectsSearchByJobOrder from "./ProjectsSearchByJobOrder";
import ProjectsSearchByLocation from "./ProjectsSearchByLocation";
import { useDebouncedCallback } from "use-debounce";

export default function ProjectsSearch() {
  const searchParams = useSearchParams();
  const { replace } = useRouter();
  const pathname = usePathname();

  const handleProjectNameFilter = useDebouncedCallback((name: string) => {
    const params = new URLSearchParams(searchParams);

    if (name) {
      params.set("name", name);
      params.set("page", "1");
    } else {
      params.delete("name");
      params.delete("page");
    }

    replace(`${pathname}?${params.toString()}`);
  }, 300);

  const handleJobOrderFilter = useDebouncedCallback((jobOrder: string) => {
    const params = new URLSearchParams(searchParams);

    if (jobOrder) {
      params.set("jobOrder", jobOrder);
      params.set("page", "1");
    } else {
      params.delete("jobOrder");
      params.delete("page");
    }

    replace(`${pathname}?${params.toString()}`);
  }, 300);

  const handleLocationFilter = useDebouncedCallback((location: string) => {
    const params = new URLSearchParams(searchParams);

    if (location) {
      params.set("location", location);
      params.set("page", "1");
    } else {
      params.delete("location");
    }

    replace(`${pathname}?${params.toString()}`);
  }, 300);

  return (
    <Stack
      direction="row"
      spacing={2}
      sx={{
        alignItems: "center",
      }}
    >
      <TextField
        sx={{
          width: "300px",
        }}
        onChange={(e) => handleJobOrderFilter(e.target.value)}
        defaultValue={searchParams.get("jobOrder")?.toString()}
        label="Job Order"
      />
      <TextField
        sx={{
          width: "300px",
        }}
        onChange={(e) => handleProjectNameFilter(e.target.value)}
        defaultValue={searchParams.get("name")?.toString()}
        label="Project Name"
      />
      <TextField
        sx={{
          width: "300px",
        }}
        onChange={(e) => handleLocationFilter(e.target.value)}
        defaultValue={searchParams.get("location")?.toString()}
        label="Location"
      />
    </Stack>
  );
}
