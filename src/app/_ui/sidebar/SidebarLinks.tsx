import DomainIcon from "@mui/icons-material/Domain";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import AssignmentIcon from "@mui/icons-material/Assignment";
import BadgeIcon from "@mui/icons-material/Badge";
import DeleteForeverOutlinedIcon from "@mui/icons-material/DeleteForeverOutlined";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

import { Role } from "@prisma/client";

const COMMON_SIDEBAR_LINKS = [
  {
    label: "Profile",
    path: "/dashboard/my-profile",
    icon: () => <AccountCircleIcon />,
  },
];

export const SIDEBAR_LINKS = {
  [Role.EMPLOYEE]: [
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
    ...COMMON_SIDEBAR_LINKS,
  ],
  [Role.ADMIN]: [
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
      path: "/dashboard/departments",
      icon: () => <DomainIcon />,
    },
    {
      label: "Archive",
      path: "/dashboard/archived",
      icon: () => <DeleteForeverOutlinedIcon />,
    },
    ...COMMON_SIDEBAR_LINKS,
  ],
  [Role.SUPER_ADMIN]: [],
};
