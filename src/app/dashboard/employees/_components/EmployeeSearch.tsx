"use client";
import { Stack, TextField } from "@mui/material";
import { useDebouncedCallback } from "use-debounce";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { LoadingButton } from "@mui/lab";
import EmployeeDepartmentSelect from "./EmployeeDepartmentSelect";
import EmployeeSearchByName from "./EmployeeSearchByName";
import EmployeeSearchByOccupation from "./EmployeeSearchByOccupation";

export default function EmployeeSearch() {
  const searchParams = useSearchParams();
  const { replace } = useRouter();
  const pathname = usePathname();

  const handleStatusChange = (status: string) => {
    const params = new URLSearchParams(searchParams);

    if (status) params.set("status", status);
    else params.delete("status");

    replace(`${pathname}?${params.toString()}`);
  };

  return (
    <Stack
      // component="form"
      // onSubmit={(e) => handleSearch(e)}
      direction="row"
      spacing={1}
      sx={{
        alignItems: "center",
        // justifyContent: "center",
      }}
    >
      <EmployeeDepartmentSelect />
      <EmployeeSearchByName />
      <EmployeeSearchByOccupation />
    </Stack>
  );
}
