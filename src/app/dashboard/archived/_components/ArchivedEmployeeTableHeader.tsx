import { Stack, Typography } from "@mui/material";
import EmployeeSearch from "./ArchivedEmployeeSearch";
import EmployeeAdd from "./ArchivedEmployeeAddFormModal";
import React from "react";

export default function ArchivedEmployeeTableHeader({
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
