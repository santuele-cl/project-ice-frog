"use client";
import { Stack, TextField } from "@mui/material";
import { useDebouncedCallback } from "use-debounce";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { LoadingButton } from "@mui/lab";
import EmployeeDepartmentSelect from "./EmployeeDepartmentSelect";
import EmployeeSearchByEmail from "./EmployeeSearchByEmail";

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
      spacing={2}
      sx={{
        alignItems: "center",
        // justifyContent: "center",
      }}
    >
      <EmployeeDepartmentSelect />
      <EmployeeSearchByEmail />
      {/* <FormControl sx={{ width: 300 }}>
        <InputLabel id="department-label">Department</InputLabel>
        <Select
          labelId="department-label"
          id="department"
          value={searchParams.get("department")?.toString()}
          label="Department"
          onChange={(e) => hanldeDepartmentChange(e.target.value)}
          // size="small"
        >
          <MenuItem value="">OFF</MenuItem>
          <MenuItem value="SYSTEMS">SYTEMS</MenuItem>
          <MenuItem value="TECHONOLOGY">TECHNOLOGY</MenuItem>
          <MenuItem value="CUSTOMIZED">CUSTOMIZED</MenuItem>
        </Select>
      </FormControl> */}
      {/* <FormControl sx={{ width: 300 }}>
        <InputLabel id="department-label">Status</InputLabel>
        <Select
          labelId="department-label"
          id="department"
          value={searchParams.get("department")?.toString()}
          label="Department"
          onChange={(e) => handleStatusChange(e.target.value)}
          // size="small"
          sx={{}}
        >
          <MenuItem value="">Off</MenuItem>
          <MenuItem value="active">Active</MenuItem>
          <MenuItem value="inactive">Inactive</MenuItem>
        </Select>
      </FormControl> */}

      {/* <LoadingButton
        //   loading={isSearching}
        // type="submit"
        variant="outlined"
        sx={{ px: 2 }}

        // onClick={handleSearch}
      >
        Search
      </LoadingButton> */}
    </Stack>
  );
}
