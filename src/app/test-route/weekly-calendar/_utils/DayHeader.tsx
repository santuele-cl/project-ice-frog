import { Box, Stack, Typography } from "@mui/material";
import dayjs, { Dayjs } from "dayjs";

interface DayHeaderProps {
  day: Dayjs;
  week: number;
}

export default function DayHeader({ day, week }: DayHeaderProps) {
  return (
    <Stack sx={{ flexDirection: "column" }}>
      <Box
        key={day.toString()}
        sx={{
          py: 2,
          px: 4,
          flex: "1",
          border: "1px solid rgba(0,0,0,0.1)",
        }}
      >
        <Typography sx={{ textAlign: "center" }}>
          {typeof day === "number" ? `Week ${day}` : day.format("ddd, MMM D")}
        </Typography>
      </Box>
    </Stack>
  );
}
