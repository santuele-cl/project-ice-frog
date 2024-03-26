"use client";
import {
  Box,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  SxProps,
} from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import LockPersonIcon from "@mui/icons-material/LockPerson";
import ArticleOutlinedIcon from "@mui/icons-material/ArticleOutlined";
import DomainIcon from "@mui/icons-material/Domain";
import GroupIcon from "@mui/icons-material/Group";
import FamilyRestroomIcon from "@mui/icons-material/FamilyRestroom";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { toKebabCase } from "@/app/_utils/utils";

type SidebarLink = {
  label: string;
  path?: string;
  icon: () => React.ReactNode;
};

type SidebarLinks = {
  label: string;
  links: SidebarLink[];
};

const sidebarLinks: SidebarLinks[] = [
  {
    label: "",
    links: [
      {
        label: "Schedules",
        path: "schedules",
        icon: () => <CalendarMonthIcon />,
      },
      {
        label: "Projects",
        path: "projects",
        icon: () => <FamilyRestroomIcon />,
      },
      {
        label: "Employees",
        path: "employees",
        icon: () => <GroupIcon />,
      },
      {
        label: "Departments",
        // TODO: Create Tech, PID, and Customized departments
        path: "departments",
        icon: () => <DomainIcon />,
      },
      // {
      //   label: "Roles and permissions",
      //   path: "roles-and-permissions",
      //   icon: () => <LockPersonIcon />,
      // },
      // {
      //   label: "Logs",
      //   icon: () => <ArticleOutlinedIcon />,
      //   path: "logs/login",
      // },
    ],
  },
  {
    label: "Account Settings",
    links: [
      {
        label: "Settings",
        path: "settings",
        icon: () => <SettingsIcon />,
      },
    ],
  },
];

export default function Sidebar({ children }: { children?: React.ReactNode }) {
  const segments = usePathname().split("/");

  return (
    <List
      sx={{
        height: "100%",
        width: 250,

        p: 2,
      }}
      component="nav"
      aria-labelledby="nested-list-subheader"
    >
      {children}

      {sidebarLinks.map(({ label, links }, i) => {
        return (
          <Box key={label + String(i)}>
            {label && <ListSubheader component="div">{label}</ListSubheader>}

            {links.map(({ label, icon, path }, i) => {
              return (
                <ListItemButton
                  sx={() => {
                    const style: SxProps = {
                      bgcolor: "primary.main",
                      color: "common.white",
                    };

                    return {
                      "&.Mui-selected:hover, &.Mui-selected, :hover": style,
                      "&.Mui-selected .MuiListItemIcon-root, :hover .MuiListItemIcon-root":
                        { color: "#fff" },
                    };
                  }}
                  key={label + String(i)}
                  selected={segments[2] === toKebabCase(label)}
                  LinkComponent={Link}
                  href={`/dashboard/${path}`}
                >
                  <ListItemIcon
                    sx={{
                      "&.Mui-selected": { color: "common.white !important" },
                    }}
                  >
                    {icon()}
                  </ListItemIcon>
                  <ListItemText primary={label} />
                </ListItemButton>
              );
            })}
          </Box>
        );
      })}
    </List>
  );
}
