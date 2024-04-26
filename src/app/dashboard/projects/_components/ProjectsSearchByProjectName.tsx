import { TextField } from "@mui/material";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";

export default function ProjectSearchByProjectName() {
  const searchParams = useSearchParams();
  const { replace } = useRouter();
  const pathname = usePathname();

  const handleProjectNameFilter = useDebouncedCallback((name: string) => {
    const params = new URLSearchParams(searchParams);

    if (name) params.set("name", name);
    else params.delete("name");

    replace(`${pathname}?${params.toString()}`);
  }, 300);

  return (
    <TextField
      sx={{
        width: "300px",
        // justifyContent: "center",
      }}
      onChange={(e) => handleProjectNameFilter(e.target.value)}
      defaultValue={searchParams.get("name")?.toString()}
      label="Project Name"
    />
  );
}
