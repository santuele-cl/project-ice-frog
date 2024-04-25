"use client";
import { TextField } from "@mui/material";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";

export default function EmployeeSearchByName() {
  const searchParams = useSearchParams();
  const { replace } = useRouter();
  const pathname = usePathname();

  const handleNameFilter = useDebouncedCallback((name: string) => {
    const params = new URLSearchParams(searchParams);

    if (name) params.set("name", name);
    else params.delete("name");

    replace(`${pathname}?${params.toString()}`);
  }, 300);

  return (
    <TextField
      onChange={(e) => handleNameFilter(e.target.value)}
      defaultValue={searchParams.get("name")?.toString()}
      label="Name"
      sx={{ width: "300px" }}
    />
  );
}
