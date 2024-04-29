"use client";
import { TextField } from "@mui/material";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";

export default function EmployeeSearchByOccupation() {
  const searchParams = useSearchParams();
  const { replace } = useRouter();
  const pathname = usePathname();

  const handleOccupationFilter = useDebouncedCallback((occupation: string) => {
    const params = new URLSearchParams(searchParams);

    if (occupation) {
      params.set("occupation", occupation);
      params.set("page", "1");
    } else {
      params.delete("occupation");
      params.delete("page");
    }

    replace(`${pathname}?${params.toString()}`);
  }, 300);

  return (
    <TextField
      onChange={(e) => handleOccupationFilter(e.target.value)}
      defaultValue={searchParams.get("occupation")?.toString()}
      label="Occupation"
      sx={{ width: "300px" }}
    />
  );
}
