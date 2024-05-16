import { Stack, Typography } from "@mui/material";
import DateButtons from "./DateButtons";
import AddScheduleFormModal from "./AddScheduleFormModal";
import AddMultipleScheduleModal from "./AddMultipleScheduleModal";

interface ScheduleTableHeaderProps {
  week: number;
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
      <Typography sx={{ fontWeight: 600 }}>{`Week ${week}`}</Typography>

      <Stack sx={{ flexDirection: "row", alignItems: "center", gap: 2 }}>
        <DateButtons />
        <AddMultipleScheduleModal />
      </Stack>
    </Stack>
  );
}
