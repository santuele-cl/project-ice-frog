import { Stack, Typography } from "@mui/material";
import EmployeeSearch from "./EmployeeSearch";
import EmployeeAdd from "./EmployeeAdd";

export default function EmployeeTableHeader() {
  return (
    <Stack sx={{ gap: 2 }}>
      <Stack
        direction="row"
        sx={{
          height: "55px",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* <Stack>
          <Typography variant="h6" gap={0}>
            Employees
          </Typography>
          <Typography variant="body1" sx={{ mt: "-4px" }}>
            Details and schedules
          </Typography>
        </Stack> */}
        <EmployeeSearch />

        <EmployeeAdd />
      </Stack>
    </Stack>
  );
}
