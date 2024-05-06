"use client";
import { Button, Link, Stack, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import NextLink from "next/link";

export default function Unauthorized() {
  const router = useRouter();
  return (
    <Stack
      sx={{
        placeItems: "center",
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        color: "gray.main",
      }}
    >
      <Typography sx={{ fontSize: 150 }}>401</Typography>
      <Stack
        sx={{
          flexDirection: "row",
          alignItems: "center",
          gap: 1,
          marginTop: "-40px",
        }}
      >
        <Typography sx={{ fontSize: 20 }}>Unauthorized</Typography>
        <Link component={NextLink} href="/">
          Home
        </Link>
      </Stack>
    </Stack>
  );
}
