import { Paper, Stack, Typography } from "@mui/material";
import Logo from "./_ui/Logo";

export default function loading() {
  return (
    <Paper>
      <Stack
        sx={{
          flexDirection: "row",
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      >
        <Logo />
        <Typography variant="h5">Synxchronize</Typography>
      </Stack>
    </Paper>
  );
}
