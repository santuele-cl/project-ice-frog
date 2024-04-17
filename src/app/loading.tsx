import { Stack } from "@mui/material";

export default function loading() {
  return (
    <Stack
      sx={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
      }}
    >
      APP LOADER
    </Stack>
  );
}
