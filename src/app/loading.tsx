import { Stack, Typography } from "@mui/material";
import Logo from "./_ui/Logo";

export default function loading() {
  return (
    <Stack
      sx={{
        bgcolor: "white",
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
      }}
    >
      <Logo />
      <Typography variant="h5">Synxchronize</Typography>
    </Stack>
  );
}
