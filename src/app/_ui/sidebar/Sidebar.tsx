"use client";
import DomainIcon from "@mui/icons-material/Domain";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import AssignmentIcon from "@mui/icons-material/Assignment";
import BadgeIcon from "@mui/icons-material/Badge";
import { Fragment } from "react";
import {
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Tooltip,
} from "@mui/material";
import { usePathname, useRouter } from "next/navigation";
import { NewListItemButton } from "../CustomListItemButton";

const links = [
  {
    label: "Schedules",
    path: "/dashboard/my-schedules/table",
    icon: () => <CalendarMonthIcon />,
  },
  {
    label: "Projects",
    path: "/dashboard/my-projects",
    icon: () => <AssignmentIcon />,
  },
];

export default function Sidebar({ open }: { open: boolean }) {
  const pathname = usePathname();
  const { push } = useRouter();

  return (
    <Fragment>
      {links.map(({ icon, label, path }) => (
        <ListItem key={path} disablePadding sx={{ display: "block" }}>
          <Tooltip title={label} placement="right">
            <NewListItemButton
              selected={path.startsWith(pathname)}
              sx={{
                minHeight: 48,
                justifyContent: open ? "initial" : "center",
                px: 2.5,
              }}
              onClick={() => push(path)}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: open ? 3 : "auto",
                  justifyContent: "center",
                  color: "inherit",
                }}
              >
                {icon()}
              </ListItemIcon>
              <ListItemText primary={label} sx={{ opacity: open ? 1 : 0 }} />
            </NewListItemButton>
          </Tooltip>
        </ListItem>
      ))}
    </Fragment>
  );
}
