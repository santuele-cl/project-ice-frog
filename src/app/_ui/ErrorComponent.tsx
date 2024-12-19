import { Stack, Typography } from "@mui/material";

export default function ErrorComponent({ errMessage }: { errMessage: string }) {
  return (
    // <Stack
    //   // sx={{
    //   //   position: "absolute",
    //   //   height: "100%",
    //   //   weight: "100%",
    //   // }}
    // >
    <Typography
      sx={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        p: 2,
        bgcolor: "error.light",
        color: "error",
      }}
    >
      {errMessage}
    </Typography>
    // </Stack>
  );
}
