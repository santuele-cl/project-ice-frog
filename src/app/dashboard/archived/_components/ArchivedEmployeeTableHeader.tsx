import { Stack } from "@mui/material";

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
