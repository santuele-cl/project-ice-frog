"use client";
import DomainIcon from "@mui/icons-material/Domain";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import AssignmentIcon from "@mui/icons-material/Assignment";
import BadgeIcon from "@mui/icons-material/Badge";
import { Fragment } from "react";
import {
  Box,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Tooltip,
} from "@mui/material";
import { usePathname, useRouter } from "next/navigation";
import DeleteForeverOutlinedIcon from "@mui/icons-material/DeleteForeverOutlined";
import { NewListItemButton } from "../CustomListItemButton";
// import CustomListItemButton from "../CustomListItemButton";

const links = [
  {
    label: "Schedules",
    path: "/dashboard/schedules",
    icon: () => <CalendarMonthIcon />,
  },
  {
    label: "Projects",
    path: "/dashboard/projects",
    icon: () => <AssignmentIcon />,
  },
  {
    label: "Employees",
    path: "/dashboard/employees",
    icon: () => <BadgeIcon />,
  },
  {
    label: "Departments",
    // TODO: Create Tech, PID, and Customized departments
    path: "/dashboard/departments",
    icon: () => <DomainIcon />,
  },
  {
    label: "Archive",
    // TODO: Create Tech, PID, and Customized departments
    path: "/dashboard/archived",
    icon: () => <DeleteForeverOutlinedIcon />,
  },
];

export default function AdminSidebar({ open }: { open: boolean }) {
  const pathname = usePathname();
  const { push } = useRouter();
  console.log("path : ", pathname);
  return (
    <Fragment>
      {links.map(({ icon, label, path }) => (
        <ListItem
          key={path}
          disablePadding
          sx={{
            display: "block",
          }}
        >
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
