import { Stack, Typography } from "@mui/material";

export default function AddMultipleScheduleForm() {
  return (
    <Stack>
      <Typography id="modal-modal-title" variant="h6" component="h2">
        TODO
      </Typography>
      <Typography id="modal-modal-description" sx={{ mt: 2 }}>
        Employee Schedule Form
      </Typography>
      <Typography id="modal-modal-description" sx={{ mt: 2 }}>
        Disable add schedule on past dates
      </Typography>
    </Stack>
  );
}
