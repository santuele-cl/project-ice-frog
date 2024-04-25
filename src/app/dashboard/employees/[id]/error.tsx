"use client";

import { Stack, Typography } from "@mui/material";

export default function EmployeeNotFound({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <Stack sx={{ width: "100%", height: "100%", position: "relative" }}>
      <Typography
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      >{`Error. ${error.message}`}</Typography>
    </Stack>
  );
}
