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

    if (name) {
      params.set("name", name);
      params.set("page", "1");
    } else {
      params.delete("name");
      params.delete("page");
    }

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
