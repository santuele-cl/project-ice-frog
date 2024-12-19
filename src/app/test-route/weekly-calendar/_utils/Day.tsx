import { Stack } from "@mui/material";
import dayjs, { Dayjs } from "dayjs";

interface DayProps {
  day: Dayjs;
}

export default function Day({ day }: DayProps) {
  return <Stack sx={{ flexDirection: "column" }}>Day</Stack>;
}
