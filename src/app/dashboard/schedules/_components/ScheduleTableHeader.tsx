import { Stack, Typography } from "@mui/material";
import DateButtons from "./DateButtons";
import AddScheduleFormModal from "./AddScheduleFormModal";
import AddMultipleScheduleModal from "./AddMultipleScheduleModal";
import SchedulesDepartmentSelect from "./SchedulesDepartmentSelect";
import dayjs from "dayjs";

interface ScheduleTableHeaderProps {
  week: string;
  weekDates: dayjs.Dayjs[];
}

export default function ScheduleTableHeader({
  week,
  weekDates,
}: ScheduleTableHeaderProps) {
  return (
    <Stack
      sx={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <Typography
        sx={{ fontWeight: 600 }}
      >{`Week ${week} : ${weekDates[0]?.format("MMM DD")} - ${weekDates[
        weekDates.length - 1
      ]?.format("MMM DD YYYY")}`}</Typography>

      <Stack sx={{ flexDirection: "row", alignItems: "center", gap: 2 }}>
        <SchedulesDepartmentSelect />
        <DateButtons />
        <AddMultipleScheduleModal />
      </Stack>
    </Stack>
  );
}
