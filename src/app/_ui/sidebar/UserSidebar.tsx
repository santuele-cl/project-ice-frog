"use client";
import { Fragment, useState } from "react";
import { ListItem, ListItemIcon, ListItemText, Tooltip } from "@mui/material";
import { usePathname, useRouter } from "next/navigation";
import { NewListItemButton } from "../CustomListItemButton";

type SidebarLink = {
  label: string;
  path: string;
  icon: () => JSX.Element;
};

type Props = {
  open: boolean;
  sidebarLinks: SidebarLink[];
};

export default function UserSidebar({ open, sidebarLinks }: Props) {
  const pathname = usePathname();
  const { push } = useRouter();

  const [tooltipOpen, setTooltipOpen] = useState(false);
  const [tooltipOpenIndex, setTooltipOpenIndex] = useState(-1);

  const handleOpen = (index: number) => {
    if (!open) {
      setTooltipOpenIndex(index);
      setTooltipOpen(true);
    }
  };

  const handleClose = () => {
    if (tooltipOpen) {
      setTooltipOpenIndex(-1);
      setTooltipOpen(false);
    }
  };

  return (
    <Fragment>
      {sidebarLinks.map(({ icon, label, path }, index) => (
        <ListItem
          key={path + index}
          disablePadding
          sx={{
            display: "block",
          }}
        >
          <Tooltip
            title={label}
            placement="right"
            open={tooltipOpen && tooltipOpenIndex === index}
            onOpen={() => handleOpen(index)}
            onClose={handleClose}
          >
            <NewListItemButton
              selected={pathname.startsWith(path)}
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
