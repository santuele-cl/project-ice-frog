import {
  Box,
  Container,
  Divider,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import EmployeeAddForm from "../_components/EmployeeAddForm";

export default function EmployeeCreatePage() {
  return (
    <Stack sx={{ gap: 2 }}>
      <Box>
        <Typography variant="h5">New Employee</Typography>
      </Box>
      <Paper
        elevation={1}
        sx={{
          p: 3,
        }}
      >
        <Stack sx={{ gap: 2 }}>
          <Typography variant="subtitle1">
            Please provide the required information in the spaces provided below
          </Typography>

          <Divider />
          <EmployeeAddForm />
        </Stack>
      </Paper>
    </Stack>
  );
}
