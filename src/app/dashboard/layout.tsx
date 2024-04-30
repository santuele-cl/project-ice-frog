"use client";
import Box from "@mui/material/Box";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";
import {
  Avatar,
  Breadcrumbs,
  Button,
  IconButton,
  Link,
  Stack,
  Theme,
  styled,
} from "@mui/material";
import MuiDrawer from "@mui/material/Drawer";
import { CSSObject } from "@emotion/react";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import MenuOpenOutlinedIcon from "@mui/icons-material/MenuOpenOutlined";
import AdminSidebar from "../_ui/sidebar/AdminSidebar";
import { useSession } from "next-auth/react";
import { logout } from "@/actions/auth";
import ExitToAppOutlinedIcon from "@mui/icons-material/ExitToAppOutlined";
import Sidebar from "../_ui/sidebar/Sidebar";
import NextLink from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

const drawerWidth = 240;

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = useSession();
  const [open, setOpen] = useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const pathname = usePathname();
  const [breadcrumbs, setBreadcrumbs] = useState<
    {
      breadcrumb: string;
      href: string;
    }[]
  >([]);

  useEffect(() => {
    if (pathname) {
      const segments = pathname.split("/").slice(2);
      const pathArray = segments.map((path, i) => {
        return {
          breadcrumb: path,
          href: "/dashboard/" + segments.slice(0, i + 1).join("/"),
        };
      });
      setBreadcrumbs(pathArray);
    }
  }, [pathname]);
  console.log(session);
  return (
    <Box sx={{ display: "flex" }}>
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
            onClick={() => setOpen((prev) => !prev)}
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
            {open ? <MenuOpenOutlinedIcon /> : <MenuOutlinedIcon />}
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
      <Drawer variant="permanent" open={open}>
        <DrawerHeader />
        <Divider />
        {session.data?.user.role !== "ADMIN" ? (
          <Sidebar open={open} />
        ) : (
          <AdminSidebar open={open} />
        )}
        <Divider />
        <List>
          {["Profile"].map((text, index) => (
            <ListItem key={text} disablePadding sx={{ display: "block" }}>
              <ListItemButton
                sx={{
                  minHeight: 48,
                  justifyContent: open ? "initial" : "center",
                  px: 2.5,
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : "auto",
                    justifyContent: "center",
                  }}
                >
                  <AccountCircleIcon />
                </ListItemIcon>
                <ListItemText primary={text} sx={{ opacity: open ? 1 : 0 }} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 2, overflowX: "auto" }}>
        <DrawerHeader />
        <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
          {breadcrumbs.map((item, i) => {
            const { breadcrumb, href } = item;
            return (
              <Link
                href={href}
                key={href + i}
                component={NextLink}
                underline={href === pathname ? "always" : "hover"}
                color={href === pathname ? "primary" : "common.black"}
                sx={{ textTransform: "capitalize", fontSize: "1rem" }}
              >
                {breadcrumb}
              </Link>
            );
          })}
        </Breadcrumbs>
        {children}
      </Box>
    </Box>
  );
}
