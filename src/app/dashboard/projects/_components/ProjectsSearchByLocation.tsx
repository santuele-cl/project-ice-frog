import { TextField } from "@mui/material";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";

export default function ProjectSearchByLocation() {
  const searchParams = useSearchParams();
  const { replace } = useRouter();
  const pathname = usePathname();

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
    <TextField
      sx={{
        width: "300px",
        // justifyContent: "center",
      }}
      onChange={(e) => handleLocationFilter(e.target.value)}
      defaultValue={searchParams.get("location")?.toString()}
      label="Location"
    />
  );
}
