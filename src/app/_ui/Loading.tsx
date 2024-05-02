"use client";
import { CircularProgress, Stack } from "@mui/material";

export default function Loading() {
  return (
    <Stack
      sx={{
        height: "100%",
        width: "100%",
        position: "relative",
      }}
    >
      <CircularProgress
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      />
    </Stack>
  );
}
