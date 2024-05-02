"use client";
import { Stack } from "@mui/material";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import EmployeeSearchByName from "./EmployeeSearchByName";
import EmployeeSearchByOccupation from "./EmployeeSearchByOccupation";
import DepartmentSelectSearch from "../../../_ui/DepartmentSelectSearch";

export default function EmployeeSearch() {
  const searchParams = useSearchParams();
  const { replace } = useRouter();
  const pathname = usePathname();

  return (
    <Stack direction="row" spacing={1} sx={{}}>
      <DepartmentSelectSearch />
      <EmployeeSearchByName />
      <EmployeeSearchByOccupation />
    </Stack>
  );
}
