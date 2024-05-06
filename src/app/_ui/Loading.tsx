"use client";
import { Box, CircularProgress, Paper, Stack, Typography } from "@mui/material";

export default function Loading() {
  return (
    <Box
      sx={{
        position: "relative",
        height: "690px",
        minHeight: "cal(100vh - 64pxs)",
      }}
    >
      <Stack
        sx={{
          color: "gray.main",
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          justifyContent: "center",
          alignItems: "center",
          gap: 2,
        }}
      >
        <CircularProgress size={50} color="inherit" />
        <Typography variant="h6" sx={{ color: "gray.main" }}>
          Loading
        </Typography>
      </Stack>
    </Box>
  );
}
