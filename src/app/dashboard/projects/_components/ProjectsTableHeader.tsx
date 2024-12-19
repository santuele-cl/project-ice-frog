import { Stack, Typography } from "@mui/material";
import ProjectsSearch from "./ProjectsSearch";
import ProjectsAdd from "./ProjectsAdd";
import React from "react";

export default function EmployeeTableHeader({
  children,
}: {
  children?: React.ReactNode;
}) {
  return (
    <Stack sx={{ gap: 2 }}>
      <Stack
        direction="row"
        sx={{
          height: "55px",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {children}
      </Stack>
    </Stack>
  );
}
