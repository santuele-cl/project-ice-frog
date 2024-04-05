import { Autocomplete, TextField } from "@mui/material";
const top100Films = [
  { label: "CUSTOMIZED" },
  { label: "TECHNOLOGY" },
  { label: "SYSTEMS" },
];
export default function EmployeeDepartmentSelect() {
  return (
    <Autocomplete
      disablePortal
      id="deparment"
      options={top100Films}
      sx={{ width: 300 }}
      renderInput={(params) => (
        <TextField {...params} label="Departments" size="small" />
      )}
    />
  );
}
