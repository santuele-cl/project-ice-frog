"use client";
import { Dispatch, SetStateAction, useState } from "react";
import { useSession } from "next-auth/react";
import { logout } from "@/actions/auth";

import {
  AppBar,
  Toolbar,
  Typography,
  Avatar,
  IconButton,
  Stack,
} from "@mui/material";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import ExitToAppOutlinedIcon from "@mui/icons-material/ExitToAppOutlined";

type Props = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
};

export default function CustomAppBar({ open, setOpen }: Props) {
  const session = useSession();
  const handleToggleOpen = () => setOpen((prev) => !prev);

  return (
    <AppBar
      position="fixed"
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        bgcolor: "white",
        color: "common.black",
      }}
      elevation={0}
    >
      <Toolbar>
        <IconButton
          onClick={handleToggleOpen}
          edge="start"
          sx={{
            marginRight: 2,
            color: "secondary.main",
            "&:hover, &:active, &:focus": {
              color: "secondary.main",
              backgroundColor: "unset",
            },
          }}
        >
          <MenuOutlinedIcon />
        </IconButton>

        <Typography variant="h6" noWrap component="div">
          Synx
        </Typography>
        <Stack
          sx={{
            ml: "auto",
            flexDirection: "row",
            alignItems: "center",
            gap: 1,
          }}
        >
          <Typography variant="subtitle1" noWrap component="div">
            {session.data?.user.email}
          </Typography>
          <Avatar
            sx={{
              bgcolor: "secondary.main",
              width: "1.5rem",
              height: "1.5rem",
            }}
          >
            {session?.data?.user.name && session?.data?.user.name[0]}
          </Avatar>
          <IconButton
            onClick={() => logout()}
            size="small"
            sx={{ color: "gray.main" }}
          >
            <ExitToAppOutlinedIcon fontSize="large" />
          </IconButton>
        </Stack>
      </Toolbar>
    </AppBar>
  );
}
