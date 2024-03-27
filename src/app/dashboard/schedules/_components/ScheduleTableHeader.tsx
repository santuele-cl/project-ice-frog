import { Stack, Typography } from "@mui/material";
import DateButtons from "./DateButtons";

interface ScheduleTableHeaderProps {
  week: string;
}

export default function ScheduleTableHeader({
  week,
}: ScheduleTableHeaderProps) {
  return (
    <Stack
      sx={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <Stack sx={{ flexDirection: "row", alignItems: "center", gap: 2 }}>
        <Typography sx={{ fontWeight: 600 }}>{`Week ${week}`}</Typography>
        <DateButtons />
      </Stack>
      <Stack></Stack>
    </Stack>
  );
}
