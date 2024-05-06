"use client";
import { LinearProgress, Paper, Stack, Typography } from "@mui/material";
import Logo from "./_ui/Logo";

export default function RootLoadingPage() {
  return (
    <Paper sx={{ bgcolor: "white", height: "100vh", minHeight: "400px" }}>
      <Stack
        sx={{
          placeItems: "center",
          flexDirection: "row",
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          gap: 2,
        }}
      >
        <Logo size={60} />
        <Stack
          sx={{
            placeItems: "center",
            gap: 2,
          }}
        >
          <Typography sx={{ fontSize: 40, fontWeight: "bold" }}>
            Synx
          </Typography>
          <LinearProgress
            color="secondary"
            sx={{ width: 90, height: 6, marginTop: "-18px" }}
          />
        </Stack>
      </Stack>
    </Paper>
  );
}
