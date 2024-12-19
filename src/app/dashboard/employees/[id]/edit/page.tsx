import { Box, Divider, Paper, Stack, Typography } from "@mui/material";
import EmployeeDetailsEdit from "./_component/EmployeeDetailsEdit";

export default function EmployeeEditPage({
  params: { id },
}: {
  params: { id: string };
}) {
  return (
    <Stack sx={{ gap: 2 }}>
      <Box>
        <Typography variant="h5">Edit employee details</Typography>
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
          <EmployeeDetailsEdit id={id} />
        </Stack>
      </Paper>
    </Stack>
  );
}
