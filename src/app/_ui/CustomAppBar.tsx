"use client";
import { Dispatch, SetStateAction } from "react";
import { useSession } from "next-auth/react";
import { logout } from "@/actions/auth";

import {
  AppBar,
  Toolbar,
  Typography,
  Avatar,
  IconButton,
  Stack,
  Button,
  Box,
} from "@mui/material";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import ExitToAppOutlinedIcon from "@mui/icons-material/ExitToAppOutlined";
import Logo from "./Logo";
import { useRouter } from "next/navigation";

type Props = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
};

export default function CustomAppBar({ open, setOpen }: Props) {
  const router = useRouter();
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

        <Stack sx={{ flexDirection: "row", alignItems: "center", gap: 1 }}>
          <Logo size={24} />
          <Typography
            onClick={() => router.push("/")}
            variant="h6"
            noWrap
            component="div"
            sx={{ fontWeight: "bold", cursor: "pointer" }}
          >
            Synx
          </Typography>
        </Stack>
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
