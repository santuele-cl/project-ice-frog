"use client";
import {
  Autocomplete,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
} from "@mui/material";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import { useDebouncedCallback } from "use-debounce";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { LoadingButton } from "@mui/lab";
import EmployeeDepartmentSelect from "./EmployeeDepartmentSelect";
import { useState } from "react";

const options = ["Option 1", "Option 2"];

export default function EmployeeSearch() {
  const searchParams = useSearchParams();
  const { replace } = useRouter();
  const pathname = usePathname();
  const params = new URLSearchParams(searchParams);

  const handleSearch = useDebouncedCallback((term: string) => {
    params.set("page", "1");

    if (term) {
      params.set("query", term);
    } else {
      params.delete("query");
    }
    replace(`${pathname}?${params.toString()}`);
  }, 300);

  const handleEmailFilter = useDebouncedCallback((email: string) => {
    if (email) params.set("email", email);
    else params.delete("email");

    replace(`${pathname}?${params.toString()}`);
  }, 300);

  const hanldeDepartmentChange = (department: string) => {
    if (department) params.set("department", department);
    else params.delete("department");

    replace(`${pathname}?${params.toString()}`);
  };
  const handleStatusChange = (status: string) => {
    if (status) params.set("status", status);
    else params.delete("status");

    replace(`${pathname}?${params.toString()}`);
  };

  const [value, setValue] = useState<string | null>(options[0]);
  const [inputValue, setInputValue] = useState("");

  return (
    <Stack
      component="form"
      // onSubmit={(e) => handleSearch(e)}
      direction="row"
      spacing={2}
      sx={{
        alignItems: "center",
        // justifyContent: "center",
      }}
    >
      <TextField
        onChange={(e) => handleEmailFilter(e.target.value)}
        value={searchParams.get("query")?.toString()}
        label="Email"
        // size="small"
      />
      <FormControl sx={{ width: 300 }}>
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
      </FormControl>
      <FormControl sx={{ width: 300 }}>
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
      </FormControl>

      <LoadingButton
        //   loading={isSearching}
        // type="submit"
        variant="outlined"
        sx={{ px: 2 }}

        // onClick={handleSearch}
      >
        Search
      </LoadingButton>
    </Stack>
  );
}
