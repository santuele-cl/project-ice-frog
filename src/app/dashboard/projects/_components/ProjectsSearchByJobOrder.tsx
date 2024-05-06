import { TextField } from "@mui/material";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";

export default function ProjectSearchByJobOrder() {
  const searchParams = useSearchParams();
  const { replace } = useRouter();
  const pathname = usePathname();

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

  return (
    <TextField
      sx={{
        width: "300px",
        // justifyContent: "center",
      }}
      onChange={(e) => handleJobOrderFilter(e.target.value)}
      defaultValue={searchParams.get("jobOrder")?.toString()}
      label="Job Order"
    />
  );
}
