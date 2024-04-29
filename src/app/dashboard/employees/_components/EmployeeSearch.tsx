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

  return (
    <Stack
      direction="row"
      spacing={1}
      sx={{
        alignItems: "center",
      }}
    >
      <EmployeeDepartmentSelect />
      <EmployeeSearchByName />
      <EmployeeSearchByOccupation />
    </Stack>
  );
}
